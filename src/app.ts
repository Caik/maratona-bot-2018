import * as dotenv from "dotenv";
import * as mongoose from "mongoose";

import { Luis } from "./bot/Luis";
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
		let name: string = session.message.text;
		name = name.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
		session.userData.name = name;
		session.send(`${getGreeting()} ${name}`);
		session.send(`Aqui vai alguns exemplos do que posso lhe ajudar:
		\n* Vasculhar algum SubReddit.
		\n     **Ex:** Me mostre os resultados do subreddit cats com score mínimo de 1000 upvotes
		\n* Ver os SubReddits mais procurados.
		\n     **Ex:** Me mostre os subreddits mais pedidos
		\n* Saber um pouco mais sobre mim.
		\n     **Ex:** Me conte mais sobre você`);
		session.send("Agora me diga, no que posso te ajudar?");

		return;
	}

	session.beginDialog("luis");
	session.endDialog();
});

bot.dialog("luis", async (session, args) => {
	const term = session.message.text;

	const luis = new Luis();
	const result = await luis.getResult(term);

	session.send(JSON.stringify(result));
});

function getGreeting(): string {
	const hour = new Date().getHours();

	if (hour < 4) {
		return "Boa noite";
	}

	if (hour < 12) {
		return "Bom dia";
	}

	if (hour < 18) {
		return "Boa tarde";
	}

	return "Boa noite";
}
