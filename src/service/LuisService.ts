import { Luis } from "../bot/Luis";
import { ILuisResponse } from "../interface/ILuisResponse";
import { ISubRedditSearch } from "../interface/ISubRedditSearch";

export class LuisService {
	public static readonly SHOW_THREADS_INTENT: string = "ShowThreads";

	public static readonly SHOW_TOP_SUBREDDITS_INTENT: string = "ShowTopSubReddits";

	public static readonly ABOUT_INTENT: string = "About";

	public static readonly NONE_INTENT: string = "None";

	public static async processTerm(term: string): Promise<ILuisResponse> {
		const luis = new Luis();
		let result: ILuisResponse;

		try {
			result = await luis.getResult(term);
		} catch (error) {
			console.error(error);
		}

		return result;
	}
	public static getIntent(luisResponse: ILuisResponse): string {
		if (!luisResponse) {
			return LuisService.NONE_INTENT;
		}

		if (luisResponse.topScoringIntent.score < 0.7) {
			return LuisService.NONE_INTENT;
		}

		return luisResponse.topScoringIntent.intent;
	}

	public static getSubRedditSearchEntities(luisResponse: ILuisResponse): ISubRedditSearch {
		const subReddit = luisResponse.entities.find(
			entity => entity.type === "Subreddit"
		).entity;

		if (!subReddit) {
			return;
		}

		const score = luisResponse.entities.find(
			entity => entity.type === "Score"
		).score;

		return { subReddit, score };
	}
}
