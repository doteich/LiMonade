package controller

import (
	"encoding/json"
	"errors"
	"limonade-backend/logging"
	"limonade-backend/mongodb"
	"net/http"
	"sort"
	"time"
)

type DurationData struct {
	StartTS  time.Time   `json:"start"`
	EndTS    time.Time   `json:"end"`
	Duration int         `json:"duration"`
	Value    interface{} `json:"value"`
	NodeName string      `json:"nodeName"`
}

func GetDataDuration(w http.ResponseWriter, r *http.Request) {
	startString := r.URL.Query().Get("start")
	endString := r.URL.Query().Get("end")
	nodeName := r.URL.Query().Get("nodeName")
	orderBy := r.URL.Query().Get("orderBy")

	tsStart, err0 := time.Parse(time.RFC3339, startString)

	if err0 != nil {
		logging.LogError(err0, "Error parsing start timestamp", "GetDataDuration")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Start timestamp has invalid format"))
		return
	}

	tsEnd, err1 := time.Parse(time.RFC3339, endString)

	if err1 != nil {
		logging.LogError(err1, "Error parsing end timestamp", "GetDataDuration")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("End timestamp has invalid format"))
		return
	}

	if tsEnd.Before(tsStart) {
		logging.LogGeneric("warning", "Start Time after End Time", "GetDataDuration")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Start timestamp must be before end timestamp"))
		return
	}

	if nodeName == "" {
		logging.LogGeneric("warning", "NodeName not provided", "GetDataDuration")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("NodeName not provided"))
		return
	}

	res := mongodb.NewMDBHandler.QueryByNodeName(nodeName, tsStart, tsEnd)
	bytes, err := calcDuration(res, orderBy)

	if err != nil {
		logging.LogError(err1, "Error marshalling json", "GetDataDuration")
	}

	w.WriteHeader(http.StatusOK)
	w.Write(bytes)
}

func calcDuration(tsData []mongodb.TimeSeriesData, order string) ([]byte, error) {
	var dur []DurationData
	length := len(tsData)

	for i := 0; i < length-1; i++ {

		dur = append(dur, DurationData{
			StartTS:  tsData[i].Timestamp,
			EndTS:    tsData[i+1].Timestamp,
			Duration: int((tsData[i+1].Timestamp.Sub(tsData[i].Timestamp)).Seconds()),
			Value:    tsData[i].Value,
			NodeName: tsData[i].Meta.NodeName,
		})
	}

	switch order {
	case "desc":
		sort.Slice(dur, func(i, j int) bool {
			return dur[i].Duration > dur[j].Duration
		})
	case "asc":
		sort.Slice(dur, func(i, j int) bool {
			return dur[i].Duration < dur[j].Duration
		})
	default:

	}

	bytes, err := json.Marshal(dur)

	if err != nil {
		return []byte(" "), errors.New("error while marshaling duration data")
	}

	return bytes, nil
}
