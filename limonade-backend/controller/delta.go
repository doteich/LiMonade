package controller

import (
	"encoding/json"
	"errors"
	"limonade-backend/logging"
	"limonade-backend/mongodb"
	"net/http"
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

	tsStart, err0 := time.Parse(time.RFC3339, startString)

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

	res, err := mongodb.NewMDBHandler.QueryByNodeName(collection, nodeName, tsStart, tsEnd)

	if err != nil {
		logging.LogError(err, "error executing mongodb query", "GetDelta")
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
