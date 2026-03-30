import { output } from "../lib/output.js";
import { requireScopes } from "../lib/config.js";
import { spotify } from "../lib/spotify.js";

const PLAYER_SCOPES = [
	"user-read-playback-state",
	"user-modify-playback-state",
	"user-read-currently-playing",
];

interface PlayerOptions {
	json: boolean;
}

interface PlayOptions {
	uri?: string;
	device?: string;
	json: boolean;
}

interface SpotifyDevice {
	id: string;
	name: string;
	type: string;
	is_active: boolean;
	volume_percent: number;
}

interface SpotifyCurrentlyPlaying {
	is_playing: boolean;
	progress_ms: number;
	item: {
		id: string;
		name: string;
		uri: string;
		artists: { name: string }[];
		album: { name: string };
		duration_ms: number;
	};
	device: SpotifyDevice;
	shuffle_state: boolean;
	repeat_state: string;
}

function handlePremiumError(err: unknown) {
	if (err instanceof Error && err.message.includes("403")) {
		console.error("Spotify Premium required for playback control.");
		process.exit(1);
	}
	throw err;
}

export async function playerNowCommand(opts: PlayerOptions) {
	requireScopes(PLAYER_SCOPES);
	const data = await spotify<SpotifyCurrentlyPlaying | Record<string, never>>(
		"/me/player/currently-playing",
	);

	if (!data || !("item" in data)) {
		output({ playing: false }, opts.json);
		return;
	}

	const result = {
		playing: data.is_playing,
		track: data.item.name,
		artist: data.item.artists.map((a) => a.name).join(", "),
		album: data.item.album.name,
		progress_ms: data.progress_ms,
		duration_ms: data.item.duration_ms,
		device: data.device?.name,
		shuffle: data.shuffle_state,
		repeat: data.repeat_state,
		uri: data.item.uri,
	};

	output(result, opts.json);
}

export async function playerPlayCommand(opts: PlayOptions) {
	requireScopes(PLAYER_SCOPES);
	try {
		const params = opts.device ? `?device_id=${opts.device}` : "";
		const body: Record<string, unknown> = {};
		if (opts.uri) {
			if (opts.uri.includes(":track:")) {
				body.uris = [opts.uri];
			} else {
				body.context_uri = opts.uri;
			}
		}
		await spotify(`/me/player/play${params}`, {
			method: "PUT",
			body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
		});
		console.log("Playing");
	} catch (err) {
		handlePremiumError(err);
	}
}

export async function playerPauseCommand() {
	requireScopes(PLAYER_SCOPES);
	try {
		await spotify("/me/player/pause", { method: "PUT" });
		console.log("Paused");
	} catch (err) {
		handlePremiumError(err);
	}
}

export async function playerNextCommand() {
	requireScopes(PLAYER_SCOPES);
	try {
		await spotify("/me/player/next", { method: "POST" });
		console.log("Skipped to next");
	} catch (err) {
		handlePremiumError(err);
	}
}

export async function playerPrevCommand() {
	requireScopes(PLAYER_SCOPES);
	try {
		await spotify("/me/player/previous", { method: "POST" });
		console.log("Skipped to previous");
	} catch (err) {
		handlePremiumError(err);
	}
}

export async function playerQueueCommand(uri: string) {
	requireScopes(PLAYER_SCOPES);
	const trackUri = uri.startsWith("spotify:") ? uri : `spotify:track:${uri}`;
	try {
		await spotify(`/me/player/queue?uri=${encodeURIComponent(trackUri)}`, {
			method: "POST",
		});
		console.log(`Added to queue: ${trackUri}`);
	} catch (err) {
		handlePremiumError(err);
	}
}

export async function playerDevicesCommand(opts: PlayerOptions) {
	requireScopes(PLAYER_SCOPES);
	const data = await spotify<{ devices: SpotifyDevice[] }>("/me/player/devices");

	const items = data.devices.map((d) => ({
		id: d.id,
		name: d.name,
		type: d.type,
		active: d.is_active,
		volume: d.volume_percent,
	}));

	output(items, opts.json);
}

export async function playerVolumeCommand(percent: string) {
	requireScopes(PLAYER_SCOPES);
	const vol = Number.parseInt(percent);
	if (Number.isNaN(vol) || vol < 0 || vol > 100) {
		console.error("Volume must be 0-100");
		process.exit(1);
	}
	try {
		await spotify(`/me/player/volume?volume_percent=${vol}`, { method: "PUT" });
		console.log(`Volume: ${vol}%`);
	} catch (err) {
		handlePremiumError(err);
	}
}

export async function playerShuffleCommand(state: string) {
	requireScopes(PLAYER_SCOPES);
	const enabled = state === "on" || state === "true";
	try {
		await spotify(`/me/player/shuffle?state=${enabled}`, { method: "PUT" });
		console.log(`Shuffle: ${enabled ? "on" : "off"}`);
	} catch (err) {
		handlePremiumError(err);
	}
}

export async function playerRepeatCommand(state: string) {
	requireScopes(PLAYER_SCOPES);
	if (!["off", "track", "context"].includes(state)) {
		console.error("Repeat state must be: off, track, or context");
		process.exit(1);
	}
	try {
		await spotify(`/me/player/repeat?state=${state}`, { method: "PUT" });
		console.log(`Repeat: ${state}`);
	} catch (err) {
		handlePremiumError(err);
	}
}
