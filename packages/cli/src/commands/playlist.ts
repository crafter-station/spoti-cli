import { output } from "../lib/output.js";
import { spotify } from "../lib/spotify.js";

interface PlaylistListOptions {
	limit: string;
	filter?: string;
	mine: boolean;
	json: boolean;
}

interface SpotifyPlaylistItem {
	id: string;
	name: string;
	description: string;
	owner: { id: string; display_name?: string };
	tracks: { total: number };
	external_urls: { spotify: string };
	public: boolean;
}

interface SpotifyUser {
	id: string;
}

interface PlaylistPage {
	items: SpotifyPlaylistItem[];
	next: string | null;
}

interface PlaylistGetOptions {
	json: boolean;
}

interface SpotifyTrackItem {
	track: {
		id: string;
		name: string;
		uri: string;
		artists: { name: string }[];
	};
}

interface PlaylistAddOptions {
	tracks: string;
}

export async function playlistListCommand(opts: PlaylistListOptions) {
	const parsedLimit = Number.parseInt(opts.limit || "20", 10);
	const limit = Number.isNaN(parsedLimit)
		? 20
		: Math.min(Math.max(parsedLimit, 1), 500);
	let filter: RegExp | undefined;
	if (opts.filter) {
		try {
			filter = new RegExp(opts.filter, "i");
		} catch (error) {
			throw new Error(
				`Invalid --filter regex: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
	const user = opts.mine ? await spotify<SpotifyUser>("/me") : undefined;
	const items: SpotifyPlaylistItem[] = [];

	let offset = 0;
	let scanned = 0;
	let next: string | null = null;

	do {
		const pageLimit = Math.min(50, 500 - scanned);
		const data = await spotify<PlaylistPage>(
			`/me/playlists?limit=${pageLimit}&offset=${offset}`,
		);

		for (const playlist of data.items) {
			scanned += 1;
			if (user && playlist.owner.id !== user.id) continue;
			if (filter && !filter.test(playlist.name)) continue;

			items.push(playlist);
			if (items.length >= limit) break;
		}

		next = data.next;
		offset += pageLimit;
	} while (items.length < limit && next && scanned < 500);

	const result = items.map((p) => ({
		id: p.id,
		name: p.name,
		tracks: p.tracks.total,
		public: p.public,
		url: p.external_urls.spotify,
	}));

	output(result, opts.json);
}

export async function playlistGetCommand(id: string, opts: PlaylistGetOptions) {
	const data = await spotify<{
		id: string;
		name: string;
		description: string;
		tracks: { items: SpotifyTrackItem[] };
		external_urls: { spotify: string };
	}>(`/playlists/${id}`);

	const result = {
		id: data.id,
		name: data.name,
		description: data.description,
		url: data.external_urls.spotify,
		tracks: data.tracks.items.map((i) => ({
			id: i.track.id,
			name: i.track.name,
			artist: i.track.artists.map((a) => a.name).join(", "),
			uri: i.track.uri,
		})),
	};

	output(result, opts.json);
}

export async function playlistAddCommand(id: string, opts: PlaylistAddOptions) {
	const uris = opts.tracks
		.split(",")
		.map((t) => (t.startsWith("spotify:") ? t : `spotify:track:${t}`));

	await spotify(`/playlists/${id}/tracks`, {
		method: "POST",
		body: JSON.stringify({ uris }),
	});

	console.log(`Added ${uris.length} tracks to playlist ${id}`);
}
