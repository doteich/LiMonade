package controller

import (
	"encoding/json"
	"errors"
	"limonade-backend/logging"
	"limonade-backend/mongodb"
	"net/http"
	"os"
	"strconv"
	"time"
)

type DeltaStruct struct {
	NodeName string  `json:"nodeName"`
	Delta    float64 `json:"delta"`
}

func GetDelta(w http.ResponseWriter, r *http.Request) {

	collection := r.URL.Query().Get("collection")
	startString := r.URL.Query().Get("start")
	endString := r.URL.Query().Get("end")
	nodeName := r.URL.Query().Get("nodeName")
	unit := r.URL.Query().Get("unit")
	shiftdelta := r.URL.Query().Get("shiftdelta")
	//lineId := r.URL.Query().Get("lineId")

	if collection == "" {
		logging.LogError(errors.New("missing collection param in query"), "Missing Param Collection", "GetDataDuration")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Parameter Collection not provided"))
		return
	}

	if nodeName == "" {
		logging.LogGeneric("warning", "NodeName not provided", "GetDelta")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("NodeName not provided"))
		return
	}

	var results result
	var sEnabled bool
	var sErr error

	if shiftdelta != "" {
		sEnabled, sErr = strconv.ParseBool(shiftdelta)

		if sErr != nil {
			logging.LogError(sErr, "Error parsing shift bool ", "GetDelta")
			w.WriteHeader(http.StatusBadRequest)
			return
		}

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

		//loc, err := time.LoadLocation("Europe/Berlin")

		start := time.Now()
		startFixed := start.Round(time.Hour)

		if start.Sub(startFixed) >= 0 {
			startFixed = startFixed.Add(time.Hour)
		}

		end := startFixed.Add(time.Hour * 7 * -24)

		for startFixed.After(end) {

			weekDay := startFixed.Weekday().String()
			var found bool
			var res result

			found, res = ww.getShift(weekDay, startFixed)
			if found {
				results = res
				break
			}

			startFixed = startFixed.Add(time.Hour * -1)

		}
		//fmt.Println(results)
	}

	var res []mongodb.TimeSeriesData
	var mErr error

	if sEnabled {
		res, mErr = mongodb.NewMDBHandler.QueryByNodeName(collection, nodeName, results.StartTS, results.EndTS)

	} else {
		tsStart, err0 := time.Parse(time.RFC3339, startString)

		if err0 != nil {
			logging.LogError(err0, "Error parsing start timestamp", "GetDelta")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Start timestamp has invalid format"))
			return
		}

		tsEnd, err1 := time.Parse(time.RFC3339, endString)

		if err1 != nil {
			logging.LogError(err1, "Error parsing end timestamp", "GetDelta")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("End timestamp has invalid format"))
			return
		}

		if tsEnd.Before(tsStart) {
			logging.LogGeneric("warning", "Start Time after End Time", "GetDelta")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Start timestamp must be before end timestamp"))
			return
		}
		res, mErr = mongodb.NewMDBHandler.QueryByNodeName(collection, nodeName, tsStart, tsEnd)
	}

	if mErr != nil {
		logging.LogError(mErr, "error executing mongodb query", "GetDelta")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var delta DeltaStruct
	var iArr []interface{}
	delta.NodeName = nodeName

	switch l := len(res); {
	case l == 0:
		delta.Delta = 0
	case l == 1:
		delta.Delta = 1
	case l > 1:

		iArr = append(iArr, res[0].Value)
		iArr = append(iArr, res[len(res)-1].Value)

		fArr, err := assertTypes(iArr)

		if err != nil {
			logging.LogError(err, "", "GetDelta")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		delta.Delta = fArr[1] - fArr[0]

		if unit != "" {
			var nErr error
			delta.Delta, nErr = convertWithUnit(collection, unit, delta.Delta, res[len(res)-1].Timestamp)

			if nErr != nil {
				logging.LogError(nErr, "error while converting delta with unit", "GetDelta")
				delta.Delta = fArr[1] - fArr[0]
			}

		}

	}
	b, err := json.Marshal(delta)

	if err != nil {
		logging.LogError(err, "Error marshaling JSON", "GetDelta")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(b)

}

func assertTypes(vArr []interface{}) ([]float64, error) {
	var fArr []float64
	var err error = nil

	for _, i := range vArr {
		switch v := i.(type) {
		case int:
			fArr = append(fArr, float64(v))
		case int32:
			fArr = append(fArr, float64(v))
		case int64:
			fArr = append(fArr, float64(v))
		case float32:
			fArr = append(fArr, float64(v))
		case float64:
			fArr = append(fArr, v)
		default:
			err = errors.New("invalid datatype - cannot convert value to f64")
		}
	}
	return fArr, err
}

func convertWithUnit(collection string, unit string, delta float64, eTime time.Time) (float64, error) {

	u, err := mongodb.NewMDBHandler.FindLastByTime(collection, unit, eTime)

	if err != nil {
		return 0, err
	}
	if len(u) < 1 {
		return 0, errors.New("no unit found in provided time period")
	}

	nDelta := delta * (float64(u[0].Value.(int64)) / 1000)

	return nDelta, nil

}
