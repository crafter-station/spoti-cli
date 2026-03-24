import { output } from "../lib/output.js";
import { spotify } from "../lib/spotify.js";

interface RecommendOptions {
	seedTracks?: string;
	seedArtists?: string;
	seedGenres?: string;
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
}

interface SearchResult {
	tracks?: { items: SpotifyTrack[] };
}

export async function recommendCommand(opts: RecommendOptions) {
	const limit = Number.parseInt(opts.limit || "20");
	const queries: string[] = [];

	if (opts.seedGenres) {
		for (const genre of opts.seedGenres.split(",")) {
			queries.push(`genre:${genre.trim()}`);
		}
	}

	if (opts.seedArtists) {
		for (const artistId of opts.seedArtists.split(",")) {
			const artist = await spotify<SpotifyArtist>(
				`/artists/${artistId.trim()}`,
			);
			queries.push(`artist:${artist.name}`);
		}
	}

	if (opts.seedTracks) {
		for (const trackId of opts.seedTracks.split(",")) {
			const track = await spotify<SpotifyTrack>(
				`/tracks/${trackId.trim()}`,
			);
			queries.push(`artist:${track.artists[0].name}`);
		}
	}

	if (queries.length === 0) {
		console.error(
			"At least one seed required: --seed-tracks, --seed-artists, or --seed-genres",
		);
		process.exit(1);
	}

	const query = queries.join(" ");
	const params = new URLSearchParams({
		q: query,
		type: "track",
		limit: String(Math.min(limit, 50)),
	});

	const data = await spotify<SearchResult>(`/search?${params}`);

	if (!data.tracks) {
		console.error("No tracks found");
		process.exit(1);
	}

	const items = data.tracks.items.map((t) => ({
		id: t.id,
		name: t.name,
		artist: t.artists.map((a) => a.name).join(", "),
		album: t.album.name,
		uri: t.uri,
		popularity: t.popularity,
	}));

	output(items, opts.json);
}
