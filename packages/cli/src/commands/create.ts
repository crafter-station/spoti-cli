import { output } from "../lib/output.js";
import { spotify } from "../lib/spotify.js";

interface CreateOptions {
	description?: string;
	public: boolean;
	follow?: boolean;
	tracks?: string;
	open: boolean;
	json: boolean;
}

interface SpotifyUser {
	id: string;
}

interface SpotifyPlaylist {
	id: string;
	name: string;
	external_urls: { spotify: string };
	uri: string;
}

export async function createCommand(name: string, opts: CreateOptions) {
	const user = await spotify<SpotifyUser>("/me");

	const playlist = await spotify<SpotifyPlaylist>(
		`/users/${user.id}/playlists`,
		{
			method: "POST",
			body: JSON.stringify({
				name,
				description: opts.description ?? "",
				public: opts.public,
			}),
		},
	);

	if (opts.follow !== false) {
		await spotify(`/playlists/${playlist.id}/followers`, {
			method: "PUT",
			body: JSON.stringify({ public: opts.public }),
		});
	}

	if (opts.tracks) {
		const uris = opts.tracks
			.split(",")
			.map((t) => (t.startsWith("spotify:") ? t : `spotify:track:${t}`));

		await spotify(`/playlists/${playlist.id}/tracks`, {
			method: "POST",
			body: JSON.stringify({ uris }),
		});

		console.log(`Added ${uris.length} tracks`);
	}

	const result = {
		id: playlist.id,
		name: playlist.name,
		url: playlist.external_urls.spotify,
		uri: playlist.uri,
	};

	if (opts.json) {
		output(result, true);
	} else {
		console.log(`Playlist created: ${result.url}`);
	}

	if (opts.open) {
		const { exec } = await import("node:child_process");
		exec(`open ${playlist.uri}`);
	}
}
