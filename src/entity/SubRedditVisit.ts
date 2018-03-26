import { ISubRedditVisit } from "../interface/ISubRedditVisit";

export class SubRedditVisit implements ISubRedditVisit {
	private _subReddit: string;

	private _createdAt: Date;

	public get subReddit(): string {
		return this._subReddit;
	}

	public set subReddit(value: string) {
		this._subReddit = value;
	}

	public get createdAt(): Date {
		return this._createdAt;
	}

	public set createdAt(value: Date) {
		this._createdAt = value;
	}

	public toJSON(): ISubRedditVisit {
		return {
			subReddit: this.subReddit,
			createdAt: this.createdAt
		};
	}
}
