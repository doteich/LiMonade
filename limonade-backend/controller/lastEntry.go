package controller

import (
	"encoding/json"
	"errors"
	"limonade-backend/logging"
	"limonade-backend/mongodb"
	"net/http"
)

func GetLastEntry(w http.ResponseWriter, r *http.Request) {
	nodeName := r.URL.Query().Get("nodeName")
	collection := r.URL.Query().Get("collection")

	if collection == "" {
		logging.LogError(errors.New("missing collection param in query"), "Missing Param Collection", "GetDataDuration")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Parameter Collection not provided"))
		return
	}

	if nodeName == "" {
		logging.LogGeneric("warning", "NodeName not provided", "GetDataByNodeName")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("NodeName not provided"))
		return
	}

	res := mongodb.NewMDBHandler.FindTopResults(collection, nodeName)

	payload, err := json.Marshal(res)

	if err != nil {
		logging.LogError(err, "Error while Marshalling Payload", "GetLastEntry")
	}

	w.WriteHeader(http.StatusOK)
	w.Write(payload)

}
