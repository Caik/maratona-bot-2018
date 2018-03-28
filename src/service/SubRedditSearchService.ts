import { RedditThread } from "../entity/RedditThread";
import { ISubRedditSearch } from "../interface/ISubRedditSearch";
import { SubRedditScraper } from "../scrapper/SubRedditScraper";

export class SuRedditSearchService {
	public static async search(
		entities: ISubRedditSearch
	): Promise<RedditThread[]> {
		// TODO Chamar o cosmosDBService

		const scrapper = new SubRedditScraper();

		scrapper.url = entities.subReddit;

		if (entities.score) {
			scrapper.minScore = entities.score;
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
