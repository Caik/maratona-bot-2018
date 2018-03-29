import * as $ from "cheerio";
import * as rp from "request-promise";

import { RedditThread } from "../entity/RedditThread";

export class SubRedditScraper {
	private readonly _protocol: string = "http://";

	private readonly _baseUrl: string = "www.reddit.com/r/";

	private _url: string;

	private _minScore: number = 1000;

	private _threads: RedditThread[] = [];

	public get url(): string {
		return this._url;
	}

	public set url(value: string) {
		this._url = value;
	}
	public get minScore(): number {
		return this._minScore;
	}

	public set minScore(value: number) {
		this._minScore = value;
	}

	public get threads(): RedditThread[] {
		return this._threads;
	}

	public set threads(value: RedditThread[]) {
		this._threads = value;
	}

	public async requestThreads(): Promise<void> {
		this.threads = [];

		const options = {
			uri: this._protocol + this._baseUrl + this.url,
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

			if (score < this.minScore) {
				return;
			}

			const thread: RedditThread = new RedditThread();
			thread.score = score;
			thread.selfLink = $(elem).attr("data-url");
			thread.subReddit = $(elem).attr("data-subreddit");
			thread.commentsLink =
				this._protocol +
				this._baseUrl +
				$(elem)
					.attr("data-permalink")
					.replace(/^\/r\//, "");

			const elementTitle = $(elem)
				.find("a.title")
				.first()
				.text();

			thread.title = elementTitle;
			thread.createdAt = new Date();

			this.threads.push(thread);
		});
	}

}
