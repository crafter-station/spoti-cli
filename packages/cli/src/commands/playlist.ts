import { output } from "../lib/output.js";
import { spotify } from "../lib/spotify.js";

interface PlaylistListOptions {
	limit: string;
	json: boolean;
}

interface SpotifyPlaylistItem {
	id: string;
	name: string;
	description: string;
	tracks: { total: number };
	external_urls: { spotify: string };
	public: boolean;
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
	const data = await spotify<{ items: SpotifyPlaylistItem[] }>(
		`/me/playlists?limit=${opts.limit || "20"}`,
	);

	const items = data.items.map((p) => ({
		id: p.id,
		name: p.name,
		tracks: p.tracks.total,
		public: p.public,
		url: p.external_urls.spotify,
	}));

	output(items, opts.json);
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
