import { RedditThread } from "../entity/RedditThread";
import { ISubRedditSearch } from "../interface/ISubRedditSearch";
import { SubRedditScraper } from "../scrapper/SubRedditScraper";

export class SubRedditSearchService {
	public static async search(
		entities: ISubRedditSearch
	): Promise<RedditThread[]> {
		const scrapper = new SubRedditScraper();

		scrapper.url = entities.subReddit;

		// TODO ver essa bosta aqui
		if (entities.score) {
			scrapper.minScore = entities.score;
		} else {
			entities.score = scrapper.minScore;
		}

		try {
			await scrapper.requestThreads();
		} catch (error) {
			console.error(error);
			return;
		}

		return scrapper.threads;
	}
}
