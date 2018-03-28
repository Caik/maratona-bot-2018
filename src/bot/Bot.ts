const builder = require("botbuilder");

import { ILuisResponse } from "../interface/ILuisResponse";
import { LuisService } from "../service/LuisService";
import { UtilsService } from "../service/UtilsService";
import { Luis } from "./Luis";

export class Bot {
	public readonly ROOT_DIALOG: string = "/";

	public readonly LUIS_ROOT_DIALOG: string = "luis";

	public readonly SHOW_THREADS_INTENT: string = "ShowThreads";

	public readonly SHOW_TOP_SUBREDDITS_INTENT: string = "ShowTopSubReddits";

	public readonly ABOUT_INTENT: string = "About";

	public readonly NONE_INTENT: string = "None";

	private _bot;

	private _connector;

	public constructor() {
		this.createConnector();
		this.createBot();
		this.setRootDialog();
		this.setLuisDialog();
		this.setShowThreadsDialog();
		this.setShowTopSubredditsDialog();
		this.setAboutDialog();
		this.setNoneDialog();
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
		this._bot.dialog(this.ROOT_DIALOG, (session, args) => {
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
				session.send(
					"Aqui vai alguns exemplos do que posso lhe ajudar:"
				);
				session.send(`* Vasculhar algum SubReddit.
					\n     Ex: **Me mostre os resultados do subreddit cats com score mínimo de 1000 upvotes**
					\n* Ver os SubReddits mais procurados.
					\n     Ex: **Me mostre os subreddits mais pedidos**
					\n* Saber um pouco mais sobre mim.
					\n     Ex: **Me conte mais sobre você**`);
				session.send("Agora me diga, no que posso te ajudar?");

				return;
			}

			session.beginDialog(this.LUIS_ROOT_DIALOG);
			session.endDialog();
		});
	}

	private setLuisDialog(): void {
		this._bot.dialog(this.LUIS_ROOT_DIALOG, async (session, args) => {
			const result = await LuisService.processTerm(session.message.text);
			const intent = LuisService.getIntent(result);

			session.beginDialog(intent, result);
		});
	}
	private setShowThreadsDialog(): void {
		this._bot.dialog(
			this.SHOW_THREADS_INTENT,
			(session, luisResponse: ILuisResponse) => {
				if (!luisResponse) {
					session.beginDialog(this.NONE_INTENT);
					session.endDialog();
					return;
				}

				const entities = LuisService.getSubRedditSearchEntities(
					luisResponse
				);

				if (!entities) {
					session.beginDialog(this.NONE_INTENT);
					session.endDialog();
					return;
				}

				session.send(
					`Perfeito! Aguarde um instante enquanto eu vasculho o SubReddit **${
						entities.subReddit
					}**`
				);

				// Chamar o redditService e pegar as threads

				// Mostrar as threads

				// session.endDialog();
			}
		);
	}
	private setShowTopSubredditsDialog(): void {
		this._bot.dialog(
			this.SHOW_TOP_SUBREDDITS_INTENT,
			(session, luisResponse) => {
				if (!luisResponse) {
					session.beginDialog(this.NONE_INTENT);
					session.endDialog();
					return;
				}

				session.send("Ótima escolha! Só um minuto que já lhe retorno");
				// Pegar os TopReddits

				// Mostrar os topReddits

				session.endDialog();
			}
		);
	}
	private setAboutDialog(): void {
		this._bot.dialog(this.ABOUT_INTENT, (session, luisResponse) => {
			session.send("Meu nome é Easy Reddit, e sou um BOT!");
			session.send(
				"Meu objetivo é lhe ajudar em algumas tarefas com o Reddit"
			);
			session.send(
				"Posso vasculhar um subreddit e achar coisas interessantes e caso queira saber o que as pessoas estão pesquisando, também posso ajudar!"
			);
			session.send(`E aí ${session.userData.name}, que tal começarmos?`);

			session.endDialog();
		});
	}
	private setNoneDialog(): void {
		this._bot.dialog(this.NONE_INTENT, (session, luisResponse) => {
			session.send(
				`Me desculpe ${
					session.userData.name
				}, não tenho certeza se entendi corretamente :(`
			);
			session.send("Que tal lhe mostrar alguns exemplos? :)");
			session.send(`* Vasculhar algum SubReddit.
				\n     Ex: **Me mostre os resultados do subreddit cats com score mínimo de 1000 upvotes**
				\n* Ver os SubReddits mais procurados.
				\n     Ex: **Me mostre os subreddits mais pedidos**
				\n* Saber um pouco mais sobre mim.
				\n     Ex: **Me conte mais sobre você**`);

			session.endDialog();
		});
	}
}
