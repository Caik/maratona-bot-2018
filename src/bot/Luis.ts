import * as qs from "query-string";
import * as rp from "request-promise";

import { ILuisResponse } from "../interface/ILuisResponse";
export class Luis {
	private readonly endpoint: string = process.env.LUIS_ENDPOINT;

	private readonly luisAppId: string = process.env.LUIS_APP_ID;

	private readonly subscriptionKey: string = process.env
		.LUIS_SUBSCRIPTION_KEY;

	public async getResult(term: string): Promise<ILuisResponse> {
		const params: string = qs.stringify({
			"subscription-key": process.env.LUIS_SUBSCRIPTION_KEY,
			timezoneOffset: "0",
			verbose: true,
			q: term
		});

		let luisResponse: ILuisResponse;
		try {
			luisResponse = await rp({
				uri: `${this.endpoint}${this.luisAppId}?${params}`,
				transform: body => JSON.parse(body)
			});
		} catch (error) {
			console.error(error);
		}

		return luisResponse;
	}
}
