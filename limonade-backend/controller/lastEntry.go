package controller

import (
	"encoding/json"
	"errors"
	"limonade-backend/logging"
	"limonade-backend/mongodb"
	"net/http"
	"strconv"
)

func GetLastEntry(w http.ResponseWriter, r *http.Request) {
	nodeName := r.URL.Query().Get("nodeName")
	collection := r.URL.Query().Get("collection")
	distinct := r.URL.Query().Get("distinct")
	exEmpty := r.URL.Query().Get("excludeEmpty")

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

	dis, err := strconv.ParseBool(distinct)

	if err != nil {
		dis = false
	}

	exEm, err := strconv.ParseBool(exEmpty)

	if err != nil {
		exEm = false
	}

	var res []mongodb.TimeSeriesData
	var e error

	if dis {
		res, e = mongodb.NewMDBHandler.FindDistinct(collection, nodeName)
	} else {
		res, e = mongodb.NewMDBHandler.FindLast(collection, nodeName, exEm)
	}

	if e != nil {
		logging.LogError(err, "error executing mongodb query", "GetLastEntry")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	payload, err := json.Marshal(res)

	if err != nil {
		logging.LogError(err, "Error while Marshalling Payload", "GetLastEntry")
	}

	w.WriteHeader(http.StatusOK)
	w.Write(payload)

}
