import { output } from "../lib/output.js";
import { spotify } from "../lib/spotify.js";

interface TrackGetOptions {
	json: boolean;
}

interface SpotifyTrack {
	id: string;
	name: string;
	uri: string;
	artists: { name: string }[];
	album: { name: string; release_date: string };
	duration_ms: number;
	popularity: number;
	explicit: boolean;
	external_urls: { spotify: string };
}

interface AudioFeatures {
	danceability: number;
	energy: number;
	key: number;
	loudness: number;
	mode: number;
	speechiness: number;
	acousticness: number;
	instrumentalness: number;
	liveness: number;
	valence: number;
	tempo: number;
	duration_ms: number;
	time_signature: number;
}

const KEY_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export async function trackGetCommand(id: string, opts: TrackGetOptions) {
	const data = await spotify<SpotifyTrack>(`/tracks/${id}`);

	const result = {
		id: data.id,
		name: data.name,
		artist: data.artists.map((a) => a.name).join(", "),
		album: data.album.name,
		released: data.album.release_date,
		duration_ms: data.duration_ms,
		popularity: data.popularity,
		explicit: data.explicit,
		uri: data.uri,
		url: data.external_urls.spotify,
	};

	output(result, opts.json);
}

export async function trackFeaturesCommand(id: string, opts: TrackGetOptions) {
	let data: AudioFeatures;
	try {
		data = await spotify<AudioFeatures>(`/audio-features/${id}`);
	} catch (err) {
		if (err instanceof Error && err.message.includes("403")) {
			console.error("Audio features endpoint is restricted by Spotify. This may require an approved app.");
			process.exit(1);
		}
		throw err;
	}

	const result = {
		danceability: data.danceability,
		energy: data.energy,
		key: KEY_NAMES[data.key] ?? data.key,
		mode: data.mode === 1 ? "major" : "minor",
		loudness: data.loudness,
		speechiness: data.speechiness,
		acousticness: data.acousticness,
		instrumentalness: data.instrumentalness,
		liveness: data.liveness,
		valence: data.valence,
		tempo: Math.round(data.tempo),
		time_signature: data.time_signature,
		duration_ms: data.duration_ms,
	};

	output(result, opts.json);
}
