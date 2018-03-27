import { Luis } from "../bot/Luis";

export class LuisService {

    public static async processTerm(term: string) {
        const luis = new Luis();
	    const result = await luis.getResult(term);
    }

}
