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

type State struct {
	Id     int    `json:"id"`
	Name   string `json:"name"`
	Schema string `json:"schema"`
}

func FetchConfig(w http.ResponseWriter, r *http.Request) {

	configType := r.URL.Query().Get("configType")
	lineId := r.URL.Query().Get("lineId")
	machineId := r.URL.Query().Get("machineId")

	if configType == "" || (configType != "machine" && configType != "line") {
		logging.LogError(errors.New("parameter config type not provided or is not equal line or machine"), "aborting http request", "fetchConfig")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Parameter configType not provided or is not equal to line or machine"))
		return
	}

	if lineId == "" {
		logging.LogError(errors.New("parameter lineId not provided"), "aborting http request", "fetchConfig")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Parameter lineId not provided"))
		return
	}

	var data []byte

	if configType == "line" {
		fileStr := fmt.Sprintf("./configs/%s/definition.json", lineId)

		lineData, err := os.ReadFile(fileStr)

		if err != nil {
			logging.LogError(err, "error while reading line definition "+fileStr, "fetchConfig")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		data = lineData
	} else if configType == "machine" {
		if machineId == "" {
			logging.LogError(errors.New("parameter machineId not provided"), "aborting http request", "fetchConfig")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Parameter machineId is necessary for config type 'machine'"))
			return
		}
		fileStr := fmt.Sprintf("./configs/%s/machine/%s/definition.json", lineId, machineId)
		machineData, err := os.ReadFile(fileStr)

		if err != nil {
			logging.LogError(err, "error while reading machine definition "+fileStr, "fetchConfig")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		data = machineData

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
		logging.LogError(err, "failed to read contents from file "+fileStr, "fetchAlarm")
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
		logging.LogError(err, "error unmarshalling json", "fetchAlarm")
		w.WriteHeader(http.StatusInternalServerError)
		return
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

func FetchState(w http.ResponseWriter, r *http.Request) {
	line := r.URL.Query().Get("line")
	machineId := r.URL.Query().Get("machineId")
	stateId := r.URL.Query().Get("stateId")

	if line == "" {
		logging.LogError(errors.New("parameter line not provided"), "aborting http request", "fetchState")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Parameter line not provided"))
		return
	}

	if machineId == "" {
		logging.LogError(errors.New("parameter machineid not provided"), "aborting http request", "fetchState")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Parameter machineId not provided"))
		return
	}

	if stateId == "" {
		fileStr := fmt.Sprintf("./configs/%s/machine/%s/state.json", line, machineId)

		byteArr, err := os.ReadFile(fileStr)

		if err != nil {
			logging.LogError(err, "failed to read contents from file "+fileStr, "fetchState")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusAccepted)
		w.Write(byteArr)

		return
	}

	stateInt, err := strconv.ParseInt(stateId, 10, 0)

	if err != nil {
		logging.LogError(err, "failed to parse stateid to int", "fetchState")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	fileStr := fmt.Sprintf("./configs/%s/machine/%s/state.json", line, machineId)

	byteArr, err := os.ReadFile(fileStr)

	if err != nil {
		logging.LogError(err, "failed to read contents from file "+fileStr, "fetchState")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var machineStates []State

	if err := json.Unmarshal(byteArr, &machineStates); err != nil {
		logging.LogError(err, "error unmarshalling json", "fetchAlarm")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var response []State

	for _, state := range machineStates {
		if state.Id == int(stateInt) {
			response = append(response, State{Id: state.Id, Name: state.Name, Schema: state.Schema})
			break
		}
	}

	rArr, err := json.Marshal(&response)

	if err != nil {
		logging.LogError(err, "failed to marshall response", "fetchState")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(rArr)

}
