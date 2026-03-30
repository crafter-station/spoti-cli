import { output } from "../lib/output.js";
import { requireScopes } from "../lib/config.js";
import { spotify } from "../lib/spotify.js";

const HISTORY_SCOPES = ["user-read-recently-played"];

interface HistoryOptions {
	limit: string;
	json: boolean;
}

interface PlayHistoryItem {
	played_at: string;
	track: {
		id: string;
		name: string;
		uri: string;
		artists: { name: string }[];
		album: { name: string };
	};
}

export async function historyCommand(opts: HistoryOptions) {
	requireScopes(HISTORY_SCOPES);
	const limit = opts.limit || "20";
	const data = await spotify<{ items: PlayHistoryItem[] }>(
		`/me/player/recently-played?limit=${limit}`,
	);

	const items = data.items.map((i) => ({
		id: i.track.id,
		name: i.track.name,
		artist: i.track.artists.map((a) => a.name).join(", "),
		album: i.track.album.name,
		played_at: i.played_at,
		uri: i.track.uri,
	}));

	output(items, opts.json);
}
