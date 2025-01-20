package controller

import (
	"encoding/json"
	"limonade-backend/logging"
	"limonade-backend/mongodb"
	"net/http"
	"os"
	"strconv"
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
	unitString := r.URL.Query().Get("unit")

	tsEntry, err := mongodb.NewMDBHandler.FindDistinct(collection, tsIdentifier)

	if err != nil {

		logging.LogError(err, "error executing mongodb query", "GetShiftTargets")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var unit float64 = 1

	if unitString != "" {
		unitEntry, err := mongodb.NewMDBHandler.FindLast(collection, unitString, false)

		if err != nil {
			logging.LogError(err, "error executing mongodb query", "GetShiftTargets")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		unit = float64(unitEntry[0].Value.(int64)) / 1000
	}

	// Change this line, to make the param available over URL Query

	bArr, err := os.ReadFile("./configs/definition.json")

	if err != nil {
		logging.LogError(err, "error while reading from definition file", "GetShiftTargets")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var ww workweek

	if err := json.Unmarshal(bArr, &ww); err != nil {
		logging.LogError(err, "error while reading parsing definition file", "GetShiftTargets")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	loc, err := time.LoadLocation("Europe/Berlin")

	if err != nil {
		logging.LogError(err, "unable to load time location", "GetShiftTargets")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var pace float64

	for _, line := range ww.Lines {
		if line.Id == lineId {
			pace = line.NominalSpeed
		}
	}

	start := tsEntry[0].Timestamp.In(loc)

	//fmt.Println(start)

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

	isProd, cShift, dev := ww.getCurrentShift(weekDay, now.In(loc))

	if isProd {
		cShiftStart := time.Date(now.Year(), now.Month(), now.Day(), cShift.Start, 0, 0, 0, loc)
		results = append(results, result{Duration: now.Sub(cShiftStart).Hours() + float64(dev), EndTS: now.In(loc), Name: cShift.Name, StartTS: cShiftStart})
	}

	results[0].Duration = results[0].EndTS.Sub(start).Hours()

	for i, res := range results {

		entry, err := mongodb.NewMDBHandler.QueryByNodeName(collection, nodeName, res.StartTS, res.EndTS)

		if err != nil {
			logging.LogError(err, "error executing mongodb query", "GetShiftTargets")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		results[i].Target = int(res.Duration * pace)

		if len(entry) < 1 {

			continue
		}

		startEntry, ok := entry[0].Value.(int64)
		endEntry, _ := entry[len(entry)-1].Value.(int64)

		if ok {
			results[i].Actual = int(float64(endEntry-startEntry) * unit)
		}

		if i == 0 {
			results[i].Actual = int(float64(endEntry) * unit)
		}

	}

	resp, err := json.Marshal(results)

	if err != nil {
		logging.LogError(err, "unable to marshal json response", "GetShiftTargets")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
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

			if t.Hour() >= s.Start && t.Hour() < 24 {
				return true, s, 0
			}

			if t.Hour() >= s.Start || t.Hour() < s.End {
				//fmt.Printf("CURRENT SHIFT IS %s on %s \n", s.Name, wd)
				return true, s, 1
			}
		} else if t.Hour() < s.End && t.Hour() >= s.Start {
			//fmt.Printf("CURRENT SHIFT IS %s on %s \n", s.Name, wd)
			return true, s, 0
		}
	}
	next := t.Add(24 * time.Hour).Weekday().String()
	d = ww.Days[next]

	for _, s := range d {
		if s.DayOverlap {
			if t.Hour() >= s.Start || t.Hour() < s.End {
				//fmt.Printf("CURRENT SHIFT IS %s on %s \n", s.Name, next)
				return true, s, 0
			}
		}
	}

	//fmt.Printf("No current shift found \n")

	return false, shift{}, 0

}

func GetShiftPaces(w http.ResponseWriter, r *http.Request) {

	nodeName := r.URL.Query().Get("nodeName")
	limit := r.URL.Query().Get("limit")
	collection := r.URL.Query().Get("collection")
	lineId := r.URL.Query().Get("lineId")
	unitString := r.URL.Query().Get("unit")

	if limit == "" {
		logging.LogGeneric("warning", "missing param: limit", "getShiftPaces")
		return
	}
	ltd, err := strconv.ParseInt(limit, 10, 0)

	if err != nil {
		logging.LogError(err, "error while casting limit to int", "getShiftPaces")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var unit []float64

	bArr, err := os.ReadFile("./configs/definition.json")

	if err != nil {
		logging.LogError(err, "error while reading from definition file", "getShiftPaces")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var ww workweek

	if err := json.Unmarshal(bArr, &ww); err != nil {
		logging.LogError(err, "error while reading parsing definition file", "getShiftPaces")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	loc, err := time.LoadLocation("Europe/Berlin")

	if err != nil {
		logging.LogError(err, "unable to load time location", "GetShiftTargets")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var pace float64

	for _, line := range ww.Lines {
		if line.Id == lineId {
			pace = line.NominalSpeed
		}
	}

	start := time.Now().In(loc)

	startFixed := start.Round(time.Hour)

	if start.Sub(startFixed) >= 0 {
		startFixed = startFixed.Add(time.Hour)
	}

	weekDay := startFixed.Weekday().String()

	var results []result

	isProd, cShift, dev := ww.getCurrentShift(weekDay, start.In(loc))

	if isProd {

		cShiftStart := time.Date(start.Year(), start.Month(), start.Day()-dev, cShift.Start, 0, 0, 0, loc)

		results = append(results, result{Duration: start.Sub(cShiftStart).Hours(), EndTS: start.In(loc), Name: cShift.Name, StartTS: cShiftStart})
		startFixed = cShiftStart
	}

	end := startFixed.Add(time.Hour * 7 * -24)

	for startFixed.After(end) {

		if len(results) == int(ltd) {
			break
		}

		weekDay = startFixed.Weekday().String()
		var found bool
		var res result

		found, res = ww.getShift(weekDay, startFixed)
		if found {
			results = append(results, res)
		}

		startFixed = startFixed.Add(time.Hour * -1)

	}

	for idx, shift := range results {

		unit = []float64{1}

		tsArr, err := mongodb.NewMDBHandler.QueryByNodeName(collection, nodeName, shift.StartTS, shift.EndTS)

		if err != nil {
			logging.LogError(err, "error fetching timeseries", "getShiftPaces")
			continue
		}

		if len(tsArr) < 2 {
			results[idx].Target = int(shift.Duration * pace)
			continue
		}

		if unitString != "" {
			u, err := getUnit(collection, unitString, shift.StartTS)
			if err != nil {
				logging.LogError(err, "error fetching init unit", "getShiftPaces")
				return
			}

			unit[0] = u
		}

		sum := float64(-tsArr[0].Value.(int64)) * unit[0]
		var l int64 = 0

		for i, e := range tsArr {
			v, ok := e.Value.(int64)
			if !ok {
				logging.LogError(err, "error casting to int64", "getShiftPaces")
				break
			}

			if l > v && i > 0 {

				if unitString != "" {

					u, err := getUnit(collection, unitString, tsArr[i-1].Timestamp)

					if err != nil {
						logging.LogError(err, "error fetching unit", "getShiftPaces")
						break
					}

					unit = append(unit, u)

					sum = sum + float64(l)*unit[len(unit)-2]
				} else {
					sum = sum + float64(l)
				}
			}
			l = v
		}

		if unitString != "" {
			u, err := getUnit(collection, unitString, shift.EndTS)
			if err != nil {
				logging.LogError(err, "error fetching init unit", "getShiftPaces")
				return
			}
			unit = append(unit, u)
		}

		sum = sum + float64(tsArr[len(tsArr)-1].Value.(int64))*unit[len(unit)-1]

		results[idx].Actual = int(sum)
		results[idx].Target = int(shift.Duration * pace)
	}
	for i, j := 0, len(results)-1; i < j; i, j = i+1, j-1 {
		results[i], results[j] = results[j], results[i]
	}

	resp, err := json.Marshal(results)

	if err != nil {
		logging.LogError(err, "unable to marshal json response", "GetShiftTargets")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(resp)

}

func getUnit(c string, u string, ts time.Time) (float64, error) {

	units, err := mongodb.NewMDBHandler.FindLastByTime(c, u, ts)

	if err != nil {
		return 0, err
	}

	if len(units) < 1 {
		return 1, nil
	}

	return float64(units[0].Value.(int64)) / 1000, nil

}
