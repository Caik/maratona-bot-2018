export interface IRedditThread {
	subReddit: string;

	title: string;

	score: number;

	selfLink: string;

	commentsLink: string;

	createdAt: Date;
}
