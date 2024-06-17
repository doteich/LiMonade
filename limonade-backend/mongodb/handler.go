package mongodb

import (
	"context"
	"errors"
	"limonade-backend/logging"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

	connectionURL := "mongodb://appuser:" + password + "@localhost:61018/?directConnection=true"

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(connectionURL))

	if err != nil {
		logging.LogError(err, "Failed to connect to MongoDB", "mongodb")
		panic(err)
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

func (mh *MongoHandler) QueryByNodeName(collection string, nodeName string, tsStart time.Time, tsEnd time.Time) ([]TimeSeriesData, error) {
	coll := mh.client.Database(mh.database).Collection(collection)
	filter := bson.D{
		{Key: "meta.nodeName", Value: nodeName},
		{Key: "ts",
			Value: bson.D{
				{Key: "$gte", Value: tsStart},
				{Key: "$lt", Value: tsEnd},
			},
		},
	}

	var res []TimeSeriesData

	cursor, err := coll.Find(ctx, filter)

	if err != nil {
		return nil, err
	}

	cursor.All(ctx, &res)

	return res, nil
}

func (mh *MongoHandler) FindDistinct(collection string, nodeName string) ([]TimeSeriesData, error) {
	coll := mh.client.Database(mh.database).Collection(collection)

	pipeline := bson.A{
		bson.D{{Key: "$match", Value: bson.D{{Key: "meta.nodeName", Value: nodeName}}}},
		bson.D{{Key: "$sort", Value: bson.D{{Key: "ts", Value: -1}}}},
		bson.D{{Key: "$limit", Value: 5}},
		bson.D{
			{Key: "$group",
				Value: bson.D{
					{Key: "_id",
						Value: bson.D{
							{Key: "nodeName", Value: "$meta.nodeName"},
							{Key: "value", Value: "$value"},
							{Key: "nodeId", Value: "$meta.nodeId"},
						},
					},
					{Key: "ts", Value: bson.D{{Key: "$last", Value: "$ts"}}},
				},
			},
		},
		bson.D{
			{Key: "$project",
				Value: bson.D{
					{Key: "_id", Value: 0},
					{Key: "meta.nodeName", Value: "$_id.nodeName"},
					{Key: "meta.nodeId", Value: "$_id.nodeId"},
					{Key: "value", Value: "$_id.value"},
					{Key: "ts", Value: 1},
				},
			},
		},
		bson.D{{Key: "$sort", Value: bson.D{{Key: "ts", Value: -1}}}},
	}

	var res []TimeSeriesData

	cursor, err := coll.Aggregate(ctx, pipeline)

	if err != nil {
		return nil, err
	}
	cursor.All(ctx, &res)

	if len(res) < 1 {
		return nil, errors.New("query did not return any results")
	}

	return res[:1], nil
}

func (mh *MongoHandler) FindLast(collection string, nodeName string, exEmpty bool) ([]TimeSeriesData, error) {

	coll := mh.client.Database(mh.database).Collection(collection)
	filter := bson.D{
		{Key: "meta.nodeName", Value: nodeName},
	}

	if exEmpty {
		filter = append(filter, primitive.E{Key: "value", Value: bson.D{
			{Key: "$exists", Value: true},
			{Key: "$ne", Value: ""},
		}})
	}

	sortParams := bson.D{{Key: "ts", Value: -1}}

	var res []TimeSeriesData

	cursor, err := coll.Find(ctx, filter, options.Find().SetSort(sortParams), options.Find().SetLimit(1))

	if err != nil {
		return nil, err
	}
	cursor.All(ctx, &res)
	return res, nil
}

func (mh *MongoHandler) FindLastByTime(collection string, nodeName string, tsEnd time.Time) ([]TimeSeriesData, error) {

	coll := mh.client.Database(mh.database).Collection(collection)
	filter := bson.D{
		{Key: "meta.nodeName", Value: nodeName},
		{Key: "ts",
			Value: bson.D{
				{Key: "$lt", Value: tsEnd},
			},
		},
	}

	sortParams := bson.D{{Key: "ts", Value: -1}}

	var res []TimeSeriesData

	cursor, err := coll.Find(ctx, filter, options.Find().SetSort(sortParams), options.Find().SetLimit(1))

	if err != nil {
		return nil, err
	}
	cursor.All(ctx, &res)
	return res, nil

}
