import * as mongoose from "mongoose";

mongoose
	.connect(process.env.COSMOSDB_HOST, {
		auth: {
			user: process.env.COSMOSDB_USER,
			password: process.env.COSMOSDB_PASSWORD
		}
	})
	.catch(error => {
		console.error(error);
		console.log("Error on connecto to Cosmos DB");
	});

export const db = mongoose.connection;
db.once("open", () => console.log("Connected to Cosmos DB"));
