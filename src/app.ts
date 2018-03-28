import * as dotenv from "dotenv";
import * as restify from "restify";
import { Server } from "restify";

import { Bot } from "./bot/Bot";

dotenv.config();

export class App {
	private _server: Server;

	private _bot: Bot;

	public constructor() {
		this.setupServer();
		this.createBot();
		this.initializeServer();
	}

	private setupServer(): void {
		this._server = restify.createServer();

		this._server.listen(process.env.PORT || 3978, () => {
			console.log(
				"%s listening to %s",
				this._server.name,
				this._server.url
			);
		});
	}

	private createBot(): void {
		this._bot = new Bot();
	}

	private initializeServer(): void {
		this._server.post("/api/messages", this.getConnector().listen());
	}

	private getConnector() {
		return this._bot.getConnector();
	}
}

const app = new App();

// const thread = new RedditThread();
// thread.score = 1;
// thread.title = "Teste";
// thread.commentsLink = "ÇINK";
// thread.selfLink = "AUHS";
// thread.createdAt = new Date();
// thread.subReddit = "SUUU";
// rtModel.create(thread.toJSON());

// const subredditVisit = new SubRedditVisit();
// subredditVisit.subReddit = "cats";
// subredditVisit.createdAt = new Date();
// svModel.create(subredditVisit.toJSON());
