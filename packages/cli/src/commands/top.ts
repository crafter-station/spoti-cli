import { output } from "../lib/output.js";
import { requireScopes } from "../lib/config.js";
import { spotify } from "../lib/spotify.js";

const TOP_SCOPES = ["user-top-read"];

interface TopOptions {
	range: string;
	limit: string;
	json: boolean;
}

interface SpotifyTrack {
	id: string;
	name: string;
	uri: string;
	artists: { name: string }[];
	album: { name: string };
	popularity: number;
}

interface SpotifyArtist {
	id: string;
	name: string;
	uri: string;
	genres: string[];
	popularity: number;
}

export async function topTracksCommand(opts: TopOptions) {
	requireScopes(TOP_SCOPES);
	const range = opts.range || "medium_term";
	const limit = opts.limit || "20";
	const data = await spotify<{ items: SpotifyTrack[] }>(
		`/me/top/tracks?time_range=${range}&limit=${limit}`,
	);

	const items = data.items.map((t, i) => ({
		rank: i + 1,
		id: t.id,
		name: t.name,
		artist: t.artists.map((a) => a.name).join(", "),
		album: t.album.name,
		popularity: t.popularity,
		uri: t.uri,
	}));

	output(items, opts.json);
}

export async function topArtistsCommand(opts: TopOptions) {
	requireScopes(TOP_SCOPES);
	const range = opts.range || "medium_term";
	const limit = opts.limit || "20";
	const data = await spotify<{ items: SpotifyArtist[] }>(
		`/me/top/artists?time_range=${range}&limit=${limit}`,
	);

	const items = data.items.map((a, i) => ({
		rank: i + 1,
		id: a.id,
		name: a.name,
		genres: a.genres.join(", "),
		popularity: a.popularity,
		uri: a.uri,
	}));

	output(items, opts.json);
}
