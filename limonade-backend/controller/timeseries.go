package controller

import (
	"encoding/json"
	"errors"
	"fmt"
	"limonade-backend/logging"
	"limonade-backend/mongodb"
	"net/http"
	"time"
)

type ChartData struct {
	Labels []string      `json:"labels"`
	Data   []interface{} `json:"data"`
}

func GetDataByNodeName(w http.ResponseWriter, r *http.Request) {

	collection := r.URL.Query().Get("collection")
	startString := r.URL.Query().Get("start")
	endString := r.URL.Query().Get("end")
	nodeName := r.URL.Query().Get("nodeName")
	chartData := r.URL.Query().Get("chartData")

	convertToChartData := false

	if chartData == "true" {
		convertToChartData = true
	}

	tsStart, err0 := time.Parse(time.RFC3339, startString)

	if collection == "" {
		logging.LogError(errors.New("missing collection param in query"), "Missing Param Collection", "GetDataDuration")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Parameter Collection not provided"))
		return
	}
	if err0 != nil {
		logging.LogError(err0, "Error parsing start timestamp", "GetDataByNodeName")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Start timestamp has invalid format"))
		return
	}

	tsEnd, err1 := time.Parse(time.RFC3339, endString)

	if err1 != nil {
		logging.LogError(err1, "Error parsing end timestamp", "GetDataByNodeName")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("End timestamp has invalid format"))
		return
	}

	if tsEnd.Before(tsStart) {
		logging.LogGeneric("warning", "Start Time after End Time", "GetDataByNodeName")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Start timestamp must be before end timestamp"))
		return
	}

	if nodeName == "" {
		logging.LogGeneric("warning", "NodeName not provided", "GetDataByNodeName")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("NodeName not provided"))
		return
	}

	res, err := mongodb.NewMDBHandler.QueryByNodeName(collection, nodeName, tsStart, tsEnd)

	if err != nil {
		logging.LogError(err, "error executing mongodb query", "GetDataByNodeName")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var payload []byte
	var mErr error

	if convertToChartData {
		payload, mErr = ConvertToChartData(res)

		if mErr != nil {
			logging.LogError(mErr, "Error marshaling Chart Data", "GetDataByNodeName")
		}

	} else {
		payload, mErr = json.Marshal(res)

		if mErr != nil {
			logging.LogError(mErr, "Error marshaling JSON", "GetDataByNodeName")
		}

	}

	w.WriteHeader(http.StatusOK)
	w.Write(payload)

}

func ConvertToChartData(tsData []mongodb.TimeSeriesData) ([]byte, error) {

	var newChartData ChartData

	for _, tsEntry := range tsData {

		loc, _ := time.LoadLocation("Europe/Berlin")
		localTs := tsEntry.Timestamp.In(loc)

		newChartData.Labels = append(newChartData.Labels, fmt.Sprintf("%d:%d:%d", localTs.Hour(), localTs.Minute(), localTs.Second()))
		newChartData.Data = append(newChartData.Data, tsEntry.Value)
	}

	bytes, err := json.Marshal(newChartData)

	if err != nil {
		return []byte(" "), errors.New("error while marshaling chart data")
	}

	return bytes, nil

}

func GetTimeSeriesData(w http.ResponseWriter, r *http.Request) {

	collection := r.URL.Query().Get("collection")
	startString := r.URL.Query().Get("start")
	endString := r.URL.Query().Get("end")

	tsStart, err0 := time.Parse(time.RFC3339, startString)

	if collection == "" {
		logging.LogError(errors.New("missing collection param in query"), "Missing Param Collection", "GetDataDuration")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Parameter Collection not provided"))
		return
	}
	if err0 != nil {
		logging.LogError(err0, "Error parsing start timestamp", "GetDataByNodeName")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Start timestamp has invalid format"))
		return
	}

	var tsEnd time.Time
	var err1 error

	if endString != "" {
		tsEnd, err1 = time.Parse(time.RFC3339, endString)

		if err1 != nil {
			logging.LogError(err1, "Error parsing end timestamp", "GetDataByNodeName")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("End timestamp has invalid format"))
			return
		}

		if tsEnd.Before(tsStart) {
			logging.LogGeneric("warning", "Start Time after End Time", "GetDataByNodeName")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Start timestamp must be before end timestamp"))
			return
		}
	} else {
		tsEnd = time.Now()
	}

	ts, err := mongodb.NewMDBHandler.SelectTimeseries(collection, tsStart, tsEnd)

	if err != nil {
		logging.LogError(err, "error executing mongodb query", "GetDataByNodeName")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	payload, err := json.Marshal(ts)

	if err != nil {
		logging.LogError(err, "Error marshaling JSON", "GetDataByNodeName")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(payload)

}
