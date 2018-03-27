export class UtilsService {
	public static getGreeting(): string {
		const hour = new Date().getHours();

		if (hour < 4) {
			return "Boa noite";
		}

		if (hour < 12) {
			return "Bom dia";
		}

		if (hour < 18) {
			return "Boa tarde";
		}

		return "Boa noite";
	}
}
