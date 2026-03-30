import { output } from "../lib/output.js";
import { requireScopes } from "../lib/config.js";
import { spotify } from "../lib/spotify.js";

const LIBRARY_READ_SCOPES = ["user-library-read"];
const LIBRARY_WRITE_SCOPES = ["user-library-read", "user-library-modify"];

interface LibraryListOptions {
	limit: string;
	offset: string;
	json: boolean;
}

interface LibraryModifyOptions {
	tracks: string;
}

interface LibraryCheckOptions {
	tracks: string;
	json: boolean;
}

interface SavedTrackItem {
	added_at: string;
	track: {
		id: string;
		name: string;
		uri: string;
		artists: { name: string }[];
		album: { name: string };
		popularity: number;
	};
}

export async function libraryListCommand(opts: LibraryListOptions) {
	requireScopes(LIBRARY_READ_SCOPES);
	const limit = opts.limit || "20";
	const offset = opts.offset || "0";
	const data = await spotify<{ items: SavedTrackItem[]; total: number }>(
		`/me/tracks?limit=${limit}&offset=${offset}`,
	);

	const items = data.items.map((i) => ({
		id: i.track.id,
		name: i.track.name,
		artist: i.track.artists.map((a) => a.name).join(", "),
		album: i.track.album.name,
		added_at: i.added_at,
		uri: i.track.uri,
	}));

	output(items, opts.json);
}

export async function librarySaveCommand(opts: LibraryModifyOptions) {
	requireScopes(LIBRARY_WRITE_SCOPES);
	const ids = opts.tracks.split(",").map((t) => t.trim().replace("spotify:track:", ""));
	await spotify("/me/tracks", {
		method: "PUT",
		body: JSON.stringify({ ids }),
	});
	console.log(`Saved ${ids.length} track(s) to library`);
}

export async function libraryRemoveCommand(opts: LibraryModifyOptions) {
	requireScopes(LIBRARY_WRITE_SCOPES);
	const ids = opts.tracks.split(",").map((t) => t.trim().replace("spotify:track:", ""));
	await spotify("/me/tracks", {
		method: "DELETE",
		body: JSON.stringify({ ids }),
	});
	console.log(`Removed ${ids.length} track(s) from library`);
}

export async function libraryCheckCommand(opts: LibraryCheckOptions) {
	requireScopes(LIBRARY_READ_SCOPES);
	const ids = opts.tracks.split(",").map((t) => t.trim().replace("spotify:track:", ""));
	const data = await spotify<boolean[]>(`/me/tracks/contains?ids=${ids.join(",")}`);

	const items = ids.map((id, i) => ({
		id,
		saved: data[i],
	}));

	output(items, opts.json);
}
