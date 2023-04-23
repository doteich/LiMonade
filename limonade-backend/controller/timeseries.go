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

	startString := r.URL.Query().Get("start")
	endString := r.URL.Query().Get("end")
	nodeName := r.URL.Query().Get("nodeName")
	chartData := r.URL.Query().Get("chartData")

	convertToChartData := false

	if chartData == "true" {
		convertToChartData = true
	}

	tsStart, err0 := time.Parse(time.RFC3339, startString)

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

	res := mongodb.NewMDBHandler.QueryByNodeName(nodeName, tsStart, tsEnd)

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
		newChartData.Labels = append(newChartData.Labels, fmt.Sprintf("%v:%v:%v", tsEntry.Timestamp.Hour(), tsEntry.Timestamp.Minute(), tsEntry.Timestamp.Second()))
		newChartData.Data = append(newChartData.Data, tsEntry.Value)
	}

	bytes, err := json.Marshal(newChartData)

	if err != nil {
		return []byte(" "), errors.New("error while marshaling chart data")
	}

	return bytes, nil

}
