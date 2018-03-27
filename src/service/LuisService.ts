import { Luis } from "../bot/Luis";

export class LuisService {

    public async processTerm(term: string) {
        const luis = new Luis();
	    const result = await luis.getResult(term);
    }

}
