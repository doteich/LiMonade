package main

import (
	"limonade-backend/controller"
	"limonade-backend/logging"
	"limonade-backend/mongodb"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {

	logging.InitLogger()

	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	mongodb.InitMongoDB()

	router.Get("/generic", controller.GetDataByNodeName)
	router.Get("/duration", controller.GetDataDuration)

	http.ListenAndServe("127.0.0.1:3000", router)

}
