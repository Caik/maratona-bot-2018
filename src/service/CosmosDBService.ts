import { SubRedditVisit } from "../entity/SubRedditVisit";
import { ISubRedditRank } from "../interface/IRedditRank";
import svModel from "../model/SubRedditVisitModel";
export class CosmosDBService {
	public static registerSearch(subReddit: string): void {
		const subRedditVisit = new SubRedditVisit();
		subRedditVisit.subReddit = subReddit;
		subRedditVisit.createdAt = new Date();

		svModel.create(subRedditVisit.toJSON());
	}

	public static async getSearchRank(): Promise<ISubRedditRank[]> {
		const ranks = await svModel.aggregate([
			{ $group: { _id: "$subReddit", count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $limit: 10 }
		]);

		return ranks;
	}
}
