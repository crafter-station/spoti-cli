import { output } from "../lib/output.js";
import { spotify } from "../lib/spotify.js";

interface ArtistOptions {
	json: boolean;
}

interface ArtistTopTracksOptions {
	market: string;
	json: boolean;
}

interface ArtistAlbumsOptions {
	limit: string;
	json: boolean;
}

interface SpotifyArtist {
	id: string;
	name: string;
	uri: string;
	genres: string[];
	popularity: number;
	followers: { total: number };
	external_urls: { spotify: string };
}

interface SpotifyTrack {
	id: string;
	name: string;
	uri: string;
	artists: { name: string }[];
	album: { name: string };
	popularity: number;
}

interface SpotifyAlbum {
	id: string;
	name: string;
	uri: string;
	album_type: string;
	release_date: string;
	total_tracks: number;
}

export async function artistGetCommand(id: string, opts: ArtistOptions) {
	const data = await spotify<SpotifyArtist>(`/artists/${id}`);

	const result = {
		id: data.id,
		name: data.name,
		genres: data.genres.join(", "),
		popularity: data.popularity,
		followers: data.followers.total,
		uri: data.uri,
		url: data.external_urls.spotify,
	};

	output(result, opts.json);
}

export async function artistTopTracksCommand(id: string, opts: ArtistTopTracksOptions) {
	const market = opts.market || "US";
	const data = await spotify<{ tracks: SpotifyTrack[] }>(
		`/artists/${id}/top-tracks?market=${market}`,
	);

	const items = data.tracks.map((t) => ({
		id: t.id,
		name: t.name,
		artist: t.artists.map((a) => a.name).join(", "),
		album: t.album.name,
		popularity: t.popularity,
		uri: t.uri,
	}));

	output(items, opts.json);
}

export async function artistAlbumsCommand(id: string, opts: ArtistAlbumsOptions) {
	const limit = opts.limit || "20";
	const data = await spotify<{ items: SpotifyAlbum[] }>(
		`/artists/${id}/albums?limit=${limit}&include_groups=album,single`,
	);

	const items = data.items.map((a) => ({
		id: a.id,
		name: a.name,
		type: a.album_type,
		released: a.release_date,
		tracks: a.total_tracks,
		uri: a.uri,
	}));

	output(items, opts.json);
}

export async function artistRelatedCommand(id: string, opts: ArtistOptions) {
	let data: { artists: SpotifyArtist[] };
	try {
		data = await spotify<{ artists: SpotifyArtist[] }>(
			`/artists/${id}/related-artists`,
		);
	} catch (err) {
		if (err instanceof Error && (err.message.includes("403") || err.message.includes("404"))) {
			console.error("Related artists endpoint is restricted by Spotify. This may require an approved app.");
			process.exit(1);
		}
		throw err;
	}

	const items = data.artists.map((a) => ({
		id: a.id,
		name: a.name,
		genres: a.genres.join(", "),
		popularity: a.popularity,
		followers: a.followers.total,
		uri: a.uri,
	}));

	output(items, opts.json);
}
