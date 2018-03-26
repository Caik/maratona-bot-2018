import * as dotenv from "dotenv";
import * as mongoose from "mongoose";

import { RedditThread } from "./entity/RedditThread";
import { SubRedditVisit } from "./entity/SubRedditVisit";
import rtModel from "./model/RedditThreadModel";
import svModel from "./model/SubRedditVisitModel";
import { SubRedditScraper } from "./scrapper/SubRedditScraper";

const restify = require("restify");
const builder = require("botbuilder");
const cognitiveservices = require("botbuilder-cognitiveservices");

dotenv.config();

// mongoose.connect(
// 	process.env.COSMOSDB_CONNSTR + process.env.COSMOSDB_DBNAME
// 	// +
// 	// 	"?ssl=true&replicaSet=globaldb"
// );

// const db = mongoose.connection;
// db.once("open", () => console.log("Connected to DB"));

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

// const scrapper = new SubRedditScraper();
// scrapper.Url = "cats";

// scrapper.requestThreads().then(() => {
// 	scrapper.Threads.forEach(thread => {});
// });

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.PORT || 3978, () => {
	console.log("%s listening to %s", server.name, server.url);
});

// Crie um chat conector para se comunicar com o Bot Framework Service
const connector = new builder.ChatConnector({
	appId: process.env.MICROSOFT_APP_ID,
	appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const inMemoryStorage = new builder.MemoryBotStorage();

const bot = new builder.UniversalBot(connector).set("storage", inMemoryStorage);

// Endpoint que irá monitorar as mensagens do usuário
server.post("/api/messages", connector.listen());

bot.dialog("/", (session, args) => {
	if (!session.userData.greeting) {
		session.send(
			"Olá, seja bem vindo ao Easy Reddit BOT. Estou aqui para procurar conteúdos no Reddit para você!"
		);

		session.send("Mas antes de tudo, diga-me, qual é o seu nome?");
		session.userData.greeting = true;
		return;
	}

	if (!session.userData.name) {
		getName(session);
		return;
	}

	session.endDialog();

	session.beginDialog("teste");
});

bot.dialog("teste", (session, args) => {
	session.send("TESTÂO");
});

function getName(session) {
	const name = session.message.text;
	session.userData.name = name;
	session.send("Olá, " + name + ". Há algo em que possa ajudar?");
}
