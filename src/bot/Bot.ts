const builder = require("botbuilder");

import { RedditThread } from "../entity/RedditThread";
import { SubRedditVisit } from "../entity/SubRedditVisit";
import { ILuisResponse } from "../interface/ILuisResponse";
import { ISubRedditRank } from "../interface/IRedditRank";
import { CosmosDBService } from "../service/CosmosDBService";
import { LuisService } from "../service/LuisService";
import { SubRedditSearchService } from "../service/SubRedditSearchService";
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
				session.sendTyping();
				session.delay(1000);
				session.send(
					"Olá, seja bem vindo ao Easy Reddit BOT. Estou aqui para procurar conteúdos no Reddit para você!"
				);

				session.sendTyping();
				session.delay(1000);
				session.send("Mas antes de tudo, diga-me, qual é o seu nome?");
				session.userData.greeting = true;
				return;
			}

			if (!session.userData.name) {
				let name: string = session.message.text;
				name = name.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
				session.userData.name = name;

				session.sendTyping();
				session.delay(1000);
				session.send(
					`${UtilsService.getGreeting()} ${name}, tudo bem?`
				);

				session.sendTyping();
				session.delay(1000);
				session.send(
					"Aqui vai alguns exemplos do que posso lhe ajudar:"
				);

				session.sendTyping();
				session.delay(2000);
				session.send(`* Vasculhar algum SubReddit.
					\n     Ex: **Me mostre os resultados do subreddit cats com score mínimo de 1000 upvotes**
					\n* Ver os SubReddits mais procurados.
					\n     Ex: **Me mostre os subreddits mais pedidos**
					\n* Saber um pouco mais sobre mim.
					\n     Ex: **Me conte mais sobre você**`);

				session.sendTyping();
				session.delay(1000);
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
			async (session, luisResponse: ILuisResponse) => {
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

				session.sendTyping();
				session.delay(1000);
				session.send(
					`Perfeito! Aguarde um instante enquanto eu vasculho o SubReddit **${
						entities.subReddit
					}**`
				);

				session.sendTyping();
				CosmosDBService.registerSearch(entities.subReddit);

				let result: RedditThread[];
				try {
					result = await SubRedditSearchService.search(entities);
				} catch (error) {
					console.error(error);
					session.send(
						`Me desculpe ${
							session.userData.name
						}, algum erro ocorreu! :(`
					);

					session.delay(1000);
					session.send(
						"Poderia tentar novamente mais tarde, por favor?"
					);
					session.endDialog();
					return;
				}

				const resultLength = result.length;

				if (resultLength === 0) {
					session.delay(1000);
					session.send(
						`Que pena ${
							session.userData.name
						}, não encontrei nenhum resultado, para o SubReddit **${
							entities.subReddit
						}** com mínimo de **${entities.score}** upvotes`
					);
					session.sendTyping();
					session.delay(1000);
					session.send(
						"Que tal tentar outro SubReddit? Ou quem sabe diminuir o valor mínimo de upvotes"
					);
				} else {
					session.send(
						`Muito bem ${
							session.userData.name
						}, encontrei ${resultLength} resultado${
							resultLength === 1 ? "" : "(s)"
						} para o SubReddit **${
							entities.subReddit
						}** com mínimo de **${
							entities.score
						}** upvotes, aí vão:`
					);

					session.sendTyping();
					session.delay(2000);

					const msg = new builder.Message(session);
					msg.attachmentLayout(builder.AttachmentLayout.carousel);
					const attachments = [];

					result.forEach(thread => {
						attachments.push(
							new builder.HeroCard(session)
								.title(thread.title)
								.subtitle(`${thread.score} upvotes`)
								.buttons([
									builder.CardAction.openUrl(
										session,
										thread.selfLink,
										"Link"
									),
									builder.CardAction.openUrl(
										session,
										thread.commentsLink,
										"Link para os comentários"
									)
								])
						);
					});

					msg.attachments(attachments);
					session.send(msg);
				}

				session.endDialog();
			}
		);
	}
	private setShowTopSubredditsDialog(): void {
		this._bot.dialog(
			this.SHOW_TOP_SUBREDDITS_INTENT,
			async (session, luisResponse) => {
				if (!luisResponse) {
					session.beginDialog(this.NONE_INTENT);
					session.endDialog();
					return;
				}

				session.sendTyping();
				session.delay(1000);
				session.send("Perfeito! Só um minuto que já lhe retorno...");
				session.sendTyping();
				session.delay(1000);

				let ranks: ISubRedditRank[];

				try {
					ranks = await CosmosDBService.getSearchRank();
				} catch (error) {
					console.error(error);
					session.sendTyping();
					session.delay(1000);
					session.send(
						`Me desculpe ${
							session.userData.name
						}, algum erro ocorreu! :(`
					);

					session.sendTyping();
					session.delay(1000);
					session.send(
						"Poderia tentar novamente mais tarde, por favor?"
					);
					session.endDialog();
					return;
				}

				session.send(`Prontinho ${session.userData.name}, aí vai`);
				session.sendTyping();
				session.delay(1000);

				const msg = new builder.Message(session);

				msg.addAttachment({
					contentType: "application/vnd.microsoft.card.adaptive",
					content: {
						type: "AdaptiveCard",
						body: [
							{
								type: "TextBlock",
								text: "Ranking",
								horizontalAlignment: "center",
								size: "large"
							},
							{
								type: "TextBlock",
								text:
									"Clique nos botões para visualizar os resultados",
								horizontalAlignment: "center",
								size: "small"
							}
						],
						actions: ranks.map((rank, i) => {
							return {
								type: "Action.Submit",
								data: `Me mostre as threads do subreddit ${
									rank._id
								}`,
								title: `${i + 1} - ${rank._id} (${
									rank.count
								} vez${rank.count !== 1 ? "es" : ""})`
							};
						})
					}
				});

				session.send(msg);
				session.endDialog();
			}
		);
	}
	private setAboutDialog(): void {
		this._bot.dialog(this.ABOUT_INTENT, (session, luisResponse) => {
			session.sendTyping();
			session.delay(1000);
			session.send("Meu nome é Easy Reddit, e sou um BOT!");
			session.sendTyping();
			session.delay(1000);
			session.send(
				"Meu objetivo é lhe ajudar em algumas tarefas com o Reddit"
			);

			session.sendTyping();
			session.delay(2000);
			session.send(
				"Posso vasculhar um subreddit e achar coisas interessantes e caso queira saber o que as pessoas estão pesquisando, também posso ajudar!"
			);

			session.sendTyping();
			session.delay(1000);
			session.send(`E aí ${session.userData.name}, que tal começarmos?`);

			session.endDialog();
		});
	}
	private setNoneDialog(): void {
		this._bot.dialog(this.NONE_INTENT, (session, luisResponse) => {
			session.sendTyping();
			session.delay(1000);
			session.send(
				`Me desculpe ${
					session.userData.name
				}, não tenho certeza se entendi corretamente :(`
			);
			session.sendTyping();
			session.delay(1000);
			session.send("Que tal lhe mostrar alguns exemplos? :)");
			session.sendTyping();
			session.delay(2000);
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
