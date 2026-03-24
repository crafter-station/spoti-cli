import { output } from "../lib/output.js";
import { spotify } from "../lib/spotify.js";

interface SearchOptions {
	type: string;
	limit: string;
	json: boolean;
}

interface SpotifyArtist {
	name: string;
}

interface SpotifyTrack {
	id: string;
	name: string;
	uri: string;
	artists: SpotifyArtist[];
	album: { name: string };
	popularity: number;
}

interface SpotifyArtistFull {
	id: string;
	name: string;
	uri: string;
	genres: string[];
	popularity: number;
}

interface SpotifyAlbum {
	id: string;
	name: string;
	uri: string;
	artists: SpotifyArtist[];
	release_date: string;
}

type SearchResult = {
	tracks?: { items: SpotifyTrack[] };
	artists?: { items: SpotifyArtistFull[] };
	albums?: { items: SpotifyAlbum[] };
};

export async function searchCommand(query: string, opts: SearchOptions) {
	const type = opts.type || "track";
	const limit = opts.limit || "10";
	const params = new URLSearchParams({ q: query, type, limit });

	const data = await spotify<SearchResult>(`/search?${params}`);

	if (type === "track" && data.tracks) {
		const items = data.tracks.items.map((t) => ({
			id: t.id,
			name: t.name,
			artist: t.artists.map((a) => a.name).join(", "),
			album: t.album.name,
			uri: t.uri,
			popularity: t.popularity,
		}));
		output(items, opts.json);
	} else if (type === "artist" && data.artists) {
		const items = data.artists.items.map((a) => ({
			id: a.id,
			name: a.name,
			genres: a.genres.join(", "),
			uri: a.uri,
			popularity: a.popularity,
		}));
		output(items, opts.json);
	} else if (type === "album" && data.albums) {
		const items = data.albums.items.map((a) => ({
			id: a.id,
			name: a.name,
			artist: a.artists.map((ar) => ar.name).join(", "),
			released: a.release_date,
			uri: a.uri,
		}));
		output(items, opts.json);
	}
}
