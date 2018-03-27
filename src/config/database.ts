import * as mongoose from "mongoose";

mongoose.connect(
	process.env.COSMOSDB_CONNSTR + process.env.COSMOSDB_DBNAME
	// +
	// 	"?ssl=true&replicaSet=globaldb"
);

export const db = mongoose.connection;
db.once("open", () => console.log("Connected to DB"));
