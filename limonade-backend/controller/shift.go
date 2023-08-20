package controller

import (
	"encoding/json"
	"fmt"
	"limonade-backend/logging"
	"limonade-backend/mongodb"
	"net/http"
	"os"
	"time"
)

type workweek struct {
	Days  map[string][]shift `json:"shifts"`
	Lines []lineconfig       `json:"lines"`
}

type lineconfig struct {
	Id           string  `json:"id"`
	NominalSpeed float64 `json:"nominalSpeed"`
}

type shift struct {
	DayOverlap bool   `json:"dayOverlap"`
	Name       string `json:"name"`
	Start      int    `json:"start"`
	End        int    `json:"end"`
}

type result struct {
	Duration float64   `json:"duration"`
	Name     string    `json:"name"`
	Actual   int       `json:"actual"`
	Target   int       `json:"target"`
	EndTS    time.Time `json:"endTs"`
	StartTS  time.Time `json:"startTs"`
}

func GetShiftTargets(w http.ResponseWriter, r *http.Request) {

	nodeName := r.URL.Query().Get("nodeName")
	tsIdentifier := r.URL.Query().Get("tsIdentifier")
	collection := r.URL.Query().Get("collection")
	lineId := r.URL.Query().Get("lineId")

	tsEntry, err := mongodb.NewMDBHandler.FindTopResults(collection, tsIdentifier)

	if err != nil {
		logging.LogError(err, "error executing mongodb query", "GetShiftTargets")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	bArr, err := os.ReadFile("./configs/definition.json")

	if err != nil {
		fmt.Println(err)
	}

	var ww workweek

	if err := json.Unmarshal(bArr, &ww); err != nil {
		fmt.Println(err)
	}

	loc, err := time.LoadLocation("Europe/Berlin")

	if err != nil {
		fmt.Println(err)
	}

	var pace float64

	for _, line := range ww.Lines {
		if line.Id == lineId {
			pace = line.NominalSpeed
		} else {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing parameter lineid"))
			return
		}
	}

	start := tsEntry[0].Timestamp.In(loc)

	fmt.Println(start)

	now := time.Now()

	startFixed := start.Round(time.Hour)

	if start.Sub(startFixed) >= 0 {
		startFixed = startFixed.Add(time.Hour)
	}

	weekDay := startFixed.Weekday().String()
	var results []result

	for startFixed.Before(now) {

		weekDay = startFixed.Weekday().String()
		var found bool
		var res result

		found, res = ww.getShift(weekDay, startFixed)
		if found {
			results = append(results, res)
		}

		startFixed = startFixed.Add(1 * time.Hour)

	}

	isProd, cShift, dev := ww.getCurrentShift(weekDay, now)

	if isProd {
		cShiftStart := time.Date(now.Year(), now.Month(), now.Day(), cShift.Start, 0, 0, 0, now.Location())
		results = append(results, result{Duration: now.Sub(cShiftStart).Hours() + float64(dev), EndTS: now, Name: cShift.Name, StartTS: cShiftStart})
	}

	results[0].Duration = results[0].EndTS.Sub(start).Hours()

	for i, res := range results {

		entry, err := mongodb.NewMDBHandler.QueryByNodeName(collection, nodeName, res.StartTS, res.EndTS)

		if err != nil {
			logging.LogError(err, "error executing mongodb query", "GetShiftTargets")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if len(entry) < 1 {
			continue
		}

		startEntry, ok := entry[0].Value.(int64)
		endEntry, _ := entry[len(entry)-1].Value.(int64)

		if ok {
			results[i].Actual = int(endEntry - startEntry)
		}

		if i == 0 {
			results[i].Actual = int(endEntry)
		}

		results[i].Target = int(res.Duration * pace)
	}

	resp, _ := json.Marshal(results)

	w.Write(resp)

}

func (ww *workweek) getShift(wd string, t time.Time) (bool, result) {

	d := ww.Days[wd]

	for _, s := range d {
		if s.End == t.Hour() && s.DayOverlap {

			return true, result{Duration: float64((s.End + 24) - s.Start), EndTS: t, Name: s.Name, StartTS: t.Add(-time.Hour * time.Duration(s.End+24-s.Start))}

		} else if s.End == t.Hour() {
			return true, result{Duration: float64(s.End - s.Start), EndTS: t, Name: s.Name, StartTS: t.Add(-time.Hour * time.Duration(s.End-s.Start))}
		}

	}
	return false, result{}
}

func (ww *workweek) getCurrentShift(wd string, t time.Time) (bool, shift, int) {
	d := ww.Days[wd]

	for _, s := range d {
		if s.DayOverlap {
			if t.Hour() >= s.Start || t.Hour() < s.End {
				fmt.Printf("CURRENT SHIFT IS %s on %s \n", s.Name, wd)
				return true, s, 24
			}
		} else if t.Hour() < s.End && t.Hour() >= s.Start {
			fmt.Printf("CURRENT SHIFT IS %s on %s \n", s.Name, wd)
			return true, s, 0
		}
	}
	next := t.Add(24 * time.Hour).Weekday().String()
	d = ww.Days[next]

	for _, s := range d {
		if s.DayOverlap {
			if t.Hour() >= s.Start || t.Hour() < s.End {
				fmt.Printf("CURRENT SHIFT IS %s on %s \n", s.Name, next)
				return true, s, 0
			}
		}
	}

	fmt.Printf("No current shift found \n")

	return false, shift{}, 0

}
