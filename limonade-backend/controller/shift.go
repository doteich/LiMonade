package main

import (
	"fmt"
	"time"
)

type day struct {
	name   string
	shifts []shift
}

type shift struct {
	dayOverlap bool
	name       string
	start      int
	end        int
}

type result struct {
	Duration float64
	Target   int
	EndTS    time.Time
}

type workweek struct {
	days map[string]day
}

//var workweek map[string]day

const pace = 1200

func main() {

	ww := workweek{make(map[string]day)}

	ww.days["Monday"] = day{name: "Montag", shifts: []shift{{name: "NS", start: 22, end: 6, dayOverlap: true}, {name: "FS", start: 6, end: 14, dayOverlap: false}, {name: "SS", start: 14, end: 22, dayOverlap: false}}}
	ww.days["Tuesday"] = day{name: "Dienstag", shifts: []shift{}}
	ww.days["Wednesday"] = day{name: "Mittwoch", shifts: []shift{}}
	ww.days["Thursday"] = day{name: "Donnerstag", shifts: []shift{{name: "NS", start: 22, end: 6, dayOverlap: true}, {name: "FS", start: 6, end: 14, dayOverlap: false}, {name: "SS", start: 14, end: 22, dayOverlap: false}}}
	ww.days["Friday"] = day{name: "Freitag", shifts: []shift{}}
	ww.days["Saturday"] = day{name: "Samstag", shifts: []shift{}}
	ww.days["Sunday"] = day{name: "Sonntag", shifts: []shift{{name: "FS", start: 22, end: 6, dayOverlap: true}}}

	startString := "2023-07-13T17:19:26+00:00"
	now := time.Now()

	start, err := time.Parse(time.RFC3339, startString)

	if err != nil {
		fmt.Println(err)
		panic(err)

	}

	startFixed := start.Round(time.Hour)

	var weekDay string
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
		cShiftStart := time.Date(now.Year(), now.Month(), now.Day(), cShift.start, 0, 0, 0, now.Location())
		fmt.Println(now.Sub(cShiftStart).Hours() + float64(dev))

		results = append(results, result{Duration: now.Sub(cShiftStart).Hours() + float64(dev), EndTS: now})

	}

	for i, res := range results {
		results[i].Target = int(res.Duration) * pace
	}

	fmt.Println(results)
}

func (ww *workweek) getShift(wd string, t time.Time) (bool, result) {

	d := ww.days[wd]

	for _, s := range d.shifts {
		if s.end == t.Hour() && s.dayOverlap {

			return true, result{Duration: float64((s.end + 24) - s.start), EndTS: t}

			//fmt.Printf("Schichtende am %s, um %d \n", day.name, s.end)
		} else if s.end == t.Hour() {
			return true, result{Duration: float64(s.end - s.start), EndTS: t}
		}

	}
	return false, result{}
}

func (ww *workweek) getCurrentShift(wd string, t time.Time) (bool, shift, int) {
	d := ww.days[wd]

	for _, s := range d.shifts {
		if s.dayOverlap {
			if t.Hour() >= s.start || t.Hour() < s.end {
				fmt.Printf("CURRENT SHIFT IS %s on %s \n", s.name, d.name)
				return true, s, 24
			}
		} else if t.Hour() < s.end && t.Hour() >= s.start {
			fmt.Printf("CURRENT SHIFT IS %s on %s \n", s.name, d.name)
			return true, s, 0
		}
	}
	next := t.Add(24 * time.Hour).Weekday().String()
	d = ww.days[next]

	for _, s := range d.shifts {
		if s.dayOverlap {
			if t.Hour() >= s.start || t.Hour() < s.end {
				fmt.Printf("CURRENT SHIFT IS %s on %s \n", s.name, d.name)
				return true, s, 0
			}
		}
	}

	fmt.Printf("No current shift found \n")

	return false, shift{}, 0

}
