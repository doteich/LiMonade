package main

import (
	"flag"
	"limonade-backend/controller"
	"limonade-backend/logging"
	"limonade-backend/mongodb"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {

	var pw string
	flag.StringVar(&pw, "pw", "mongodb-password", "password for mongodb")
	flag.Parse()

	logging.InitLogger()

	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	mongodb.InitMongoDB(pw)

	router.Get("/timeseries", controller.GetDataByNodeName)
	router.Get("/timeseries/all", controller.GetTimeSeriesData)
	router.Get("/timeseries/shifts", controller.GetShiftTargets)
	router.Get("/timeseries/shiftpaces", controller.GetShiftPaces)
	router.Get("/timeseries/delta", controller.GetDelta)
	router.Get("/distinct", controller.GetLastEntry)
	router.Get("/duration", controller.GetDataDuration)
	router.Get("/last", controller.GetLastEntry)
	router.Get("/config", controller.FetchConfig)
	router.Get("/config/alarm", controller.FetchAlarm)
	router.Get("/config/state", controller.FetchState)

	// fs := http.FileServer(http.Dir("/etc/"))
	// router.Handle("/etc/*", http.StripPrefix("/etc/", fs))

	http.ListenAndServe("127.0.0.1:3000", router)

}
