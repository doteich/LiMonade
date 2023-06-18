package controller

import (
	"errors"
	"limonade-backend/logging"
	"net/http"
	"os"
)

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
