import * as $ from "cheerio";
import * as rp from "request-promise";

import { RedditThread } from "../entity/RedditThread";

export class SubRedditScraper {
	private readonly protocol: string = "http://";

	private readonly baseUrl: string = "www.reddit.com/r/";

	private url: string;

	private minScore: number = 5000;

	private threads: RedditThread[] = [];

	public get Url(): string {
		return this.url;
	}

	public set Url(value: string) {
		this.url = value;
	}
	public get MinScore(): number {
		return this.minScore;
	}

	public set MinScore(value: number) {
		this.minScore = value;
	}

	public get Threads(): RedditThread[] {
		return this.threads;
	}

	public set Threads(value: RedditThread[]) {
		this.threads = value;
	}

	public async requestThreads(): Promise<void> {
		this.Threads = [];

		const options = {
			uri: this.protocol + this.baseUrl + this.Url,
			transform: body => {
				return $.load(body);
			}
		};

		let parsedHTML;
		try {
			parsedHTML = await rp(options);
		} catch (error) {
			console.error(error);
		}

		parsedHTML(".thing").each((i, element) => {
			const elem = $(element);
			const score = parseInt($(elem).attr("data-score"), 10);

			if (score < this.MinScore) {
				return;
			}

			const thread: RedditThread = new RedditThread();
			thread.score = score;
			thread.selfLink = $(elem).attr("data-url");
			thread.subReddit = $(elem).attr("data-subreddit");
			thread.commentsLink =
				this.protocol +
				this.baseUrl +
				$(elem)
					.attr("data-permalink")
					.replace(/^\/r\//, "");

			const elementTitle = $(elem)
				.find("a.title")
				.first()
				.text();

			thread.title = elementTitle;
			thread.createdAt = new Date();

			this.Threads.push(thread);
		});
	}

	public threadsToString(): string {
		let text: string = "";

		if (this.Threads.length === 0) {
			text += "Nenhuma Thread a ser mostrada!\n";
			text += " - Subreddit: " + this.Url + "\n";
			text += " - Score mínimo: " + this.MinScore + "\n";
			text += "----------------------------------------\n";
			return text;
		}

		this.Threads.forEach(thread => {
			text += thread.toString();
		});

		return text;
	}
}
