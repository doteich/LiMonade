package controller

import (
	"encoding/json"
	"fmt"
	"limonade-backend/mongodb"
	"net/http"
	"os"
	"time"
)

type workweek struct {
	Days map[string][]shift `json:"shifts"`
}

type day struct {
	name   string
	shifts []shift
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

// type workweek struct {
// 	days map[string]day
// }

//var workweek map[string]day

const pace float64 = 3870

func GetShiftTargets(w http.ResponseWriter, r *http.Request) {

	nodeName := r.URL.Query().Get("nodeName")
	tsIdentifier := r.URL.Query().Get("tsIdentifier")
	collection := r.URL.Query().Get("collection")

	tsEntry := mongodb.NewMDBHandler.FindTopResults(collection, tsIdentifier)

	bArr, err := os.ReadFile("./configs/definition.json")

	if err != nil {
		fmt.Println(err)
	}

	var ww workweek

	if err := json.Unmarshal(bArr, &ww); err != nil {
		fmt.Println(err)
	}

	// ww := def.Days

	//ww := workweek{make(map[string]day)}

	// ww.days["Monday"] = day{name: "Montag", shifts: []shift{{name: "NS", start: 20, end: 6, dayOverlap: true}, {name: "FS", start: 6, end: 14, dayOverlap: false}, {name: "SS", start: 14, end: 22, dayOverlap: false}}}
	// ww.days["Tuesday"] = day{name: "Dienstag", shifts: []shift{{name: "NS", start: 22, end: 6, dayOverlap: true}, {name: "FS", start: 6, end: 14, dayOverlap: false}, {name: "SS", start: 14, end: 22, dayOverlap: false}}}
	// ww.days["Wednesday"] = day{name: "Mittwoch", shifts: []shift{{name: "NS", start: 22, end: 6, dayOverlap: true}, {name: "FS", start: 6, end: 14, dayOverlap: false}, {name: "SS", start: 14, end: 22, dayOverlap: false}}}
	// ww.days["Thursday"] = day{name: "Donnerstag", shifts: []shift{{name: "NS", start: 22, end: 6, dayOverlap: true}, {name: "FS", start: 6, end: 14, dayOverlap: false}, {name: "SS", start: 14, end: 22, dayOverlap: false}}}
	// ww.days["Friday"] = day{name: "Freitag", shifts: []shift{{name: "NS", start: 22, end: 6, dayOverlap: true}, {name: "FS", start: 6, end: 14, dayOverlap: false}, {name: "SS", start: 14, end: 22, dayOverlap: false}}}
	// ww.days["Saturday"] = day{name: "Samstag", shifts: []shift{{name: "NS", start: 22, end: 6, dayOverlap: true}, {name: "FS", start: 6, end: 14, dayOverlap: false}}}
	// ww.days["Sunday"] = day{name: "Sonntag", shifts: []shift{}}

	loc, err := time.LoadLocation("Europe/Berlin")

	if err != nil {
		fmt.Println(err)
	}

	start := tsEntry[0].Timestamp.In(loc)

	fmt.Println(start)

	now := time.Now()

	//start, err := time.Parse(time.RFC3339, startString)

	// if err != nil {
	// 	fmt.Println(err)
	// 	panic(err)

	// }

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

		entry := mongodb.NewMDBHandler.QueryByNodeName(collection, nodeName, res.StartTS, res.EndTS)

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
