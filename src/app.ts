import * as dotenv from "dotenv";
import * as restify from "restify";
import { Server } from "restify";

import { Bot } from "./bot/Bot";
import { CosmosDBService } from "./service/CosmosDBService";

dotenv.config();

export class App {
	private _server: Server;

	private _bot: Bot;

	public constructor() {
		this.setupServer();
		this.createBot();
		this.initializeServer();
		this.configureDatabase();
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

	private configureDatabase() {
		require("./config/database");
	}
} 

const app = new App();
