import { IRedditThread } from "../interface/IRedditThread";

export class RedditThread implements IRedditThread {
	private _subReddit: string;

	private _title: string;

	private _score: number;

	private _selfLink: string;

	private _commentsLink: string;

	private _createdAt: Date;

	public get subReddit(): string {
		return this._subReddit;
	}

	public set subReddit(value: string) {
		this._subReddit = value;
	}

	public get title(): string {
		return this._title;
	}

	public set title(value: string) {
		this._title = value;
	}

	public get score(): number {
		return this._score;
	}

	public set score(value: number) {
		this._score = value;
	}

	public get selfLink(): string {
		return this._selfLink;
	}

	public set selfLink(value: string) {
		this._selfLink = value;
	}

	public get commentsLink(): string {
		return this._commentsLink;
	}

	public set commentsLink(value: string) {
		this._commentsLink = value;
	}

	public get createdAt(): Date {
		return this._createdAt;
	}

	public set createdAt(value: Date) {
		this._createdAt = value;
	}

	public toJSON(): IRedditThread {
		return {
			subReddit: this.subReddit,
			title: this.title,
			score: this.score,
			selfLink: this.selfLink,
			commentsLink: this.commentsLink,
			createdAt: this.createdAt
		};
	}

	public toString(): string {
		let ret: string = "";
		ret += "Título: " + this.title + "\n";
		ret += " - SubReddit: " + this.subReddit + "\n";
		ret += " - Link: " + this.selfLink + "\n";
		ret += " - Score: " + this.score + "\n";
		ret += " - Link para os comentários: " + this.commentsLink + "\n";
		ret += "----------------------------------------\n";

		return ret;
	}
}
