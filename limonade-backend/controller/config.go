package controller

import (
	"encoding/json"
	"errors"
	"fmt"
	"limonade-backend/logging"
	"net/http"
	"os"
	"strconv"
)

type Alarm struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

func FetchConfig(w http.ResponseWriter, r *http.Request) {

	configType := r.URL.Query().Get("configType")
	name := r.URL.Query().Get("name")

	if configType == "" {
		logging.LogError(errors.New("parameter config type not provided"), "aborting http request", "fetchConfig")
		w.Write([]byte("Parameter configType not provided"))
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if name == "" {
		logging.LogError(errors.New("parameter name not provided"), "aborting http request", "fetchConfig")
		w.Write([]byte("Parameter name not provided"))
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var data []byte

	if configType == "line" {
		fileStr := "./configs/" + name + "/definition.json"

		lineData, err := os.ReadFile(fileStr)

		if err != nil {
			logging.LogError(err, "error while reading line definition "+fileStr, "fetchConfig")
			return
		}

		data = lineData
	}

	w.Write(data)

}

func FetchAlarm(w http.ResponseWriter, r *http.Request) {
	line := r.URL.Query().Get("line")
	machineId := r.URL.Query().Get("machineId")
	alarmId := r.URL.Query().Get("alarmId")

	if line == "" {
		logging.LogError(errors.New("parameter line not provided"), "aborting http request", "fetchAlarm")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Parameter line not provided"))
		return
	}

	if machineId == "" {
		logging.LogError(errors.New("parameter machineId not provided"), "aborting http request", "fetchAlarm")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Parameter machineId not provided"))
		return
	}

	if alarmId == "" {
		logging.LogError(errors.New("parameter alarmId not provided"), "aborting http request", "fetchAlarm")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Parameter alarmId not provided"))

		return
	}

	fileStr := fmt.Sprintf("./configs/%s/machine/%s/alarm.json", line, machineId)
	byteArr, err := os.ReadFile(fileStr)

	if err != nil {
		logging.LogError(err, "error while reading alarm definition "+fileStr, "fetchAlarm")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	aInt, err := strconv.ParseInt(alarmId, 10, 0)

	if err != nil {
		logging.LogError(err, "error while parsing alarm id", "fetchAlarm")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var alarmList []Alarm
	var response Alarm

	if err := json.Unmarshal(byteArr, &alarmList); err != nil {
		fmt.Println(err)
	}

	for _, el := range alarmList {
		if el.Id == int(aInt) {
			response.Id = el.Id
			response.Name = el.Name
		}
	}

	if response.Name == "" {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	rArr, err := json.Marshal(response)

	if err != nil {
		logging.LogError(err, "error while marshalling response", "fetchAlarm")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(rArr)

}
