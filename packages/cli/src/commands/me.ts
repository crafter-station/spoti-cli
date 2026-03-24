import { output } from "../lib/output.js";
import { spotify } from "../lib/spotify.js";

interface MeOptions {
	json: boolean;
}

interface SpotifyUser {
	id: string;
	display_name: string;
	email: string;
	product: string;
	country: string;
	external_urls: { spotify: string };
}

export async function meCommand(opts: MeOptions) {
	const user = await spotify<SpotifyUser>("/me");

	const result = {
		id: user.id,
		name: user.display_name,
		email: user.email,
		plan: user.product,
		country: user.country,
		url: user.external_urls.spotify,
	};

	output(result, opts.json);
}
