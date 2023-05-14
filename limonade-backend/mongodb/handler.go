package mongodb

import (
	"context"
	"limonade-backend/logging"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var ctx = context.TODO()

type MongoHandler struct {
	client   *mongo.Client
	database string
}

type TimeSeriesData struct {
	Meta      MetaData    `bson:"meta" json:"meta"`
	Timestamp time.Time   `bson:"ts" json:"ts"`
	Value     interface{} `bson:"value" json:"Value" `
}

type MetaData struct {
	NodeId   string `bson:"nodeId" json:"nodeId"`
	NodeName string `bson:"nodeName" json:"nodeName"`
	LogName  string `bson:"logName" json:"logName"`
	Server   string `bson:"server" json:"server"`
	DataType string `bson:"dataType" json:"dataType"`
}

var NewMDBHandler MongoHandler

func InitMongoDB(password string) {

	connectionURL := "mongodb://appuser:" + password + "@192.168.178.107:31511/?directConnection=true"

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(connectionURL))

	if err != nil {
		logging.LogError(err, "Failed to connect to MongoDB", "mongodb")
	}

	err = client.Ping(ctx, readpref.Primary())

	if err != nil {
		logging.LogError(err, "Failed to ping to MongoDB", "mongodb")
		panic(err)
	}
	logging.LogGeneric("info", "Successfully connected and pinged mongodb", "mongodb")

	newHandler := MongoHandler{client: client, database: "machine-data"}

	NewMDBHandler = newHandler

}

func (mh *MongoHandler) QueryByNodeName(collection string, nodeName string, tsStart time.Time, tsEnd time.Time) []TimeSeriesData {
	coll := mh.client.Database(mh.database).Collection(collection)
	filter := bson.D{
		{"meta.nodeName", nodeName},
		{"ts",
			bson.D{
				{"$gte", tsStart},
				{"$lt", tsEnd},
			},
		},
	}

	var res []TimeSeriesData

	cursor, err := coll.Find(ctx, filter)

	if err != nil {
		logging.LogError(err, "Error getting collection", "QueryByNodeName")
	}

	cursor.All(ctx, &res)

	return res
}

func (mh *MongoHandler) FindTopResults(collection string, nodeName string) []TimeSeriesData {
	coll := mh.client.Database(mh.database).Collection(collection)
	filter := bson.D{
		{"meta.nodeName", nodeName},
	}

	sortParams := bson.D{{"ts", -1}}

	var res []TimeSeriesData

	cursor, err := coll.Find(ctx, filter, options.Find().SetSort(sortParams), options.Find().SetLimit(1))

	if err != nil {
		logging.LogError(err, "Error getting collection", "QueryByNodeName")
	}
	cursor.All(ctx, &res)
	return res
}
