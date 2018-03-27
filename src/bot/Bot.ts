const builder = require("botbuilder");

import { UtilsService } from "../service/UtilsService";
import { Luis } from "./Luis";

export class Bot {
	private _bot;

	private _connector;

	public constructor() {
		this.createConnector();
		this.createBot();
		this.setRootDialog();
		this.setLuisDialog();
	}

	public getConnector() {
		return this._connector;
	}

	private createConnector(): void {
		this._connector = new builder.ChatConnector({
			appId: process.env.MICROSOFT_APP_ID,
			appPassword: process.env.MICROSOFT_APP_PASSWORD
		});
	}

	private createBot(): void {
		this._bot = new builder.UniversalBot(this._connector).set(
			"storage",
			new builder.MemoryBotStorage()
		);
	}

	private setRootDialog(): void {
		this._bot.dialog("/", (session, args) => {
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

				session.send(
					`${UtilsService.getGreeting()} ${name}, tudo bem?`
				);
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
	}

	private setLuisDialog(): void {
		this._bot.dialog("luis", async (session, args) => {
			const term = session.message.text;

			const luis = new Luis();
			const result = await luis.getResult(term);

			session.send(JSON.stringify(result));
		});
	}
}
