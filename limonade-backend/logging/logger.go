package logging

import (
	"os"

	"golang.org/x/exp/slog"
)

var (
	Logger *slog.Logger
)

func InitLogger() {
	logOpts := slog.HandlerOptions{Level: slog.LevelInfo}
	textHandler := logOpts.NewTextHandler(os.Stdout)
	Logger = slog.New(textHandler)
}

func LogGeneric(lvl string, msg string, pkg string) {

	switch lvl {
	case "info":
		Logger.Info(msg, slog.String("package", pkg))
	case "warning":
		Logger.Warn(msg, slog.String("package", pkg))
	case "debug":
		Logger.Debug(msg, slog.String("package", pkg))
	}
}

func LogError(err error, msg string, pkg string) {
	Logger.Error(msg, err, slog.String("package", pkg))
}
