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

function toUri(input: string): string {
	const trimmed = input.trim();
	return trimmed.startsWith("spotify:") ? trimmed : `spotify:track:${trimmed}`;
}

function uriToId(uri: string): string {
	const parts = uri.split(":");
	return parts[parts.length - 1] ?? uri;
}

export async function libraryListCommand(opts: LibraryListOptions) {
	requireScopes(LIBRARY_READ_SCOPES);
	const limit = opts.limit || "20";
	const offset = opts.offset || "0";
	// /me/tracks still works for read; /me/library doesn't expose a list
	// endpoint as of Feb 2026. Falls back transparently.
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
	const uris = opts.tracks.split(",").map(toUri);
	const query = uris.map(encodeURIComponent).join(",");
	await spotify(`/me/library?uris=${query}`, { method: "PUT" });
	console.log(`Saved ${uris.length} track(s) to library`);
}

export async function libraryRemoveCommand(opts: LibraryModifyOptions) {
	requireScopes(LIBRARY_WRITE_SCOPES);
	const uris = opts.tracks.split(",").map(toUri);
	const query = uris.map(encodeURIComponent).join(",");
	await spotify(`/me/library?uris=${query}`, { method: "DELETE" });
	console.log(`Removed ${uris.length} track(s) from library`);
}

export async function libraryCheckCommand(opts: LibraryCheckOptions) {
	requireScopes(LIBRARY_READ_SCOPES);
	const uris = opts.tracks.split(",").map(toUri);
	const query = uris.map(encodeURIComponent).join(",");
	const data = await spotify<boolean[]>(`/me/library/contains?uris=${query}`);

	const items = uris.map((uri, i) => ({
		id: uriToId(uri),
		uri,
		saved: data[i],
	}));

	output(items, opts.json);
}
