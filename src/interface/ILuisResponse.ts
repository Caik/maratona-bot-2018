export interface ILuisResponse {
	query: string;

	topScoringIntent: { intent: string; score: number };

	intents: Array<{ intent: string; score: number }>;

	entities: Array<{
		entity: string;
		type: string;
		startIndex: number;
		endIndex: number;
		score: number;
	}>;
}
