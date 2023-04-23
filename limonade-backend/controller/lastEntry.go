package controller

import (
	"encoding/json"
	"limonade-backend/logging"
	"limonade-backend/mongodb"
	"net/http"
)

func GetLastEntry(w http.ResponseWriter, r *http.Request) {
	nodeName := r.URL.Query().Get("nodeName")

	if nodeName == "" {
		logging.LogGeneric("warning", "NodeName not provided", "GetDataByNodeName")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("NodeName not provided"))
		return
	}

	res := mongodb.NewMDBHandler.FindTopResults(nodeName)

	payload, err := json.Marshal(res)

	if err != nil {
		logging.LogError(err, "Error while Marshalling Payload", "GetLastEntry")
	}

	w.WriteHeader(http.StatusOK)
	w.Write(payload)

}
