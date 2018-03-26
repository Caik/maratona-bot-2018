import * as mongoose from "mongoose";

import { Schema } from "mongoose";
import { IRedditThread } from "../interface/IRedditThread";

type RedditThreadType = IRedditThread & mongoose.Document;

export default mongoose.model<RedditThreadType>(
	"RedditThread",
	new Schema({
		subReddit: String,
		title: String,
		score: Number,
		selfLink: String,
		commentsLink: String,
		createdAt: Date
	})
);
