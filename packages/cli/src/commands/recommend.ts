import { output } from "../lib/output.js";
import { spotify } from "../lib/spotify.js";

interface RecommendOptions {
	seedTracks?: string;
	seedArtists?: string;
	seedGenres?: string;
	limit: string;
	energy?: string;
	danceability?: string;
	valence?: string;
	tempo?: string;
	popularity?: string;
	acousticness?: string;
	instrumentalness?: string;
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

export async function recommendCommand(opts: RecommendOptions) {
	const params = new URLSearchParams({ limit: opts.limit || "20" });

	if (opts.seedTracks) params.set("seed_tracks", opts.seedTracks);
	if (opts.seedArtists) params.set("seed_artists", opts.seedArtists);
	if (opts.seedGenres) params.set("seed_genres", opts.seedGenres);

	if (!opts.seedTracks && !opts.seedArtists && !opts.seedGenres) {
		console.error(
			"At least one seed required: --seed-tracks, --seed-artists, or --seed-genres",
		);
		process.exit(1);
	}

	if (opts.energy) params.set("target_energy", opts.energy);
	if (opts.danceability) params.set("target_danceability", opts.danceability);
	if (opts.valence) params.set("target_valence", opts.valence);
	if (opts.tempo) params.set("target_tempo", opts.tempo);
	if (opts.popularity) params.set("target_popularity", opts.popularity);
	if (opts.acousticness) params.set("target_acousticness", opts.acousticness);
	if (opts.instrumentalness)
		params.set("target_instrumentalness", opts.instrumentalness);

	const data = await spotify<{ tracks: SpotifyTrack[] }>(
		`/recommendations?${params}`,
	);

	const items = data.tracks.map((t) => ({
		id: t.id,
		name: t.name,
		artist: t.artists.map((a) => a.name).join(", "),
		album: t.album.name,
		uri: t.uri,
		popularity: t.popularity,
	}));

	output(items, opts.json);
}
