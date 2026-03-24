import { Command } from "commander";
import { authCommand } from "./commands/auth.js";
import { createCommand } from "./commands/create.js";
import { meCommand } from "./commands/me.js";
import {
	playlistAddCommand,
	playlistGetCommand,
	playlistListCommand,
} from "./commands/playlist.js";
import { recommendCommand } from "./commands/recommend.js";
import { searchCommand } from "./commands/search.js";

const program = new Command();

program
	.name("spoti-cli")
	.description("Spotify Web API from your terminal")
	.version("0.1.0");

program
	.command("auth")
	.description("Authenticate with Spotify (OAuth2 PKCE)")
	.option("-c, --client-id <id>", "Spotify app client ID")
	.action((opts) => authCommand(opts.clientId));

program
	.command("search <query>")
	.description("Search for tracks, artists, or albums")
	.option("-t, --type <type>", "Search type: track, artist, album", "track")
	.option("-l, --limit <n>", "Number of results", "10")
	.option("--json", "Output as JSON", false)
	.action((query, opts) => searchCommand(query, opts));

program
	.command("recommend")
	.description("Get track recommendations based on seeds")
	.option("--seed-tracks <ids>", "Comma-separated track IDs")
	.option("--seed-artists <ids>", "Comma-separated artist IDs")
	.option("--seed-genres <genres>", "Comma-separated genres")
	.option("-l, --limit <n>", "Number of recommendations", "20")
	.option("--energy <n>", "Target energy (0.0-1.0)")
	.option("--danceability <n>", "Target danceability (0.0-1.0)")
	.option("--valence <n>", "Target valence/positiveness (0.0-1.0)")
	.option("--tempo <n>", "Target tempo in BPM")
	.option("--popularity <n>", "Target popularity (0-100)")
	.option("--acousticness <n>", "Target acousticness (0.0-1.0)")
	.option("--instrumentalness <n>", "Target instrumentalness (0.0-1.0)")
	.option("--json", "Output as JSON", false)
	.action((opts) => recommendCommand(opts));

program
	.command("create <name>")
	.description("Create a new playlist")
	.option("-d, --description <text>", "Playlist description")
	.option("--public", "Make playlist public", false)
	.option("--tracks <uris>", "Comma-separated track URIs or IDs to add")
	.option("--json", "Output as JSON", false)
	.action((name, opts) => createCommand(name, opts));

program
	.command("me")
	.description("Show current user profile")
	.option("--json", "Output as JSON", false)
	.action((opts) => meCommand(opts));

const playlist = program.command("playlist").description("Manage playlists");

playlist
	.command("list")
	.description("List your playlists")
	.option("-l, --limit <n>", "Number of playlists", "20")
	.option("--json", "Output as JSON", false)
	.action((opts) => playlistListCommand(opts));

playlist
	.command("get <id>")
	.description("Get playlist details and tracks")
	.option("--json", "Output as JSON", false)
	.action((id, opts) => playlistGetCommand(id, opts));

playlist
	.command("add <id>")
	.description("Add tracks to a playlist")
	.requiredOption("--tracks <uris>", "Comma-separated track URIs or IDs")
	.action((id, opts) => playlistAddCommand(id, opts));

program.parse();
