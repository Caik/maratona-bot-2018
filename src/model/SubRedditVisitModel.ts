import * as mongoose from "mongoose";

import { Schema } from "mongoose";
import { ISubRedditVisit } from "../interface/ISubRedditVisit";

type SubRedditVisitType = ISubRedditVisit & mongoose.Document;

export default mongoose.model<SubRedditVisitType>(
	"SubRedditVisit",
	new Schema({
		subReddit: String,
		createdAt: Date
	})
);
