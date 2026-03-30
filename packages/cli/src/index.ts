import { Command } from "commander";
import { authCommand } from "./commands/auth.js";
import {
	artistAlbumsCommand,
	artistGetCommand,
	artistRelatedCommand,
	artistTopTracksCommand,
} from "./commands/artist.js";
import { createCommand } from "./commands/create.js";
import { historyCommand } from "./commands/history.js";
import {
	libraryCheckCommand,
	libraryListCommand,
	libraryRemoveCommand,
	librarySaveCommand,
} from "./commands/library.js";
import { meCommand } from "./commands/me.js";
import {
	playerDevicesCommand,
	playerNextCommand,
	playerNowCommand,
	playerPauseCommand,
	playerPlayCommand,
	playerPrevCommand,
	playerQueueCommand,
	playerRepeatCommand,
	playerShuffleCommand,
	playerVolumeCommand,
} from "./commands/player.js";
import {
	playlistAddCommand,
	playlistGetCommand,
	playlistListCommand,
} from "./commands/playlist.js";
import { recommendCommand } from "./commands/recommend.js";
import { searchCommand } from "./commands/search.js";
import { topArtistsCommand, topTracksCommand } from "./commands/top.js";
import { trackFeaturesCommand, trackGetCommand } from "./commands/track.js";

const program = new Command();

program
	.name("spoti-cli")
	.description("Spotify Web API from your terminal")
	.version("0.3.0");

program
	.command("auth")
	.description("Authenticate with Spotify (OAuth2 PKCE)")
	.option("-c, --client-id <id>", "Spotify app client ID")
	.option("-u, --upgrade", "Re-authenticate with expanded permissions", false)
	.action((opts) => authCommand(opts.clientId, opts.upgrade));

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
	.option("-o, --open", "Open playlist in Spotify app after creation", false)
	.option("--json", "Output as JSON", false)
	.action((name, opts) => createCommand(name, opts));

program
	.command("me")
	.description("Show current user profile")
	.option("--json", "Output as JSON", false)
	.action((opts) => meCommand(opts));

program
	.command("history")
	.description("Recently played tracks")
	.option("-l, --limit <n>", "Number of tracks (max 50)", "20")
	.option("--json", "Output as JSON", false)
	.action((opts) => historyCommand(opts));

// --- player ---

const player = program.command("player").description("Control playback");

player
	.command("now")
	.description("Show currently playing track")
	.option("--json", "Output as JSON", false)
	.action((opts) => playerNowCommand(opts));

player
	.command("play")
	.description("Start or resume playback")
	.option("--uri <uri>", "Track, album, or playlist URI to play")
	.option("--device <id>", "Device ID to play on")
	.option("--json", "Output as JSON", false)
	.action((opts) => playerPlayCommand(opts));

player
	.command("pause")
	.description("Pause playback")
	.action(() => playerPauseCommand());

player
	.command("next")
	.description("Skip to next track")
	.action(() => playerNextCommand());

player
	.command("prev")
	.description("Skip to previous track")
	.action(() => playerPrevCommand());

player
	.command("queue <uri>")
	.description("Add a track to the queue")
	.action((uri) => playerQueueCommand(uri));

player
	.command("devices")
	.description("List available devices")
	.option("--json", "Output as JSON", false)
	.action((opts) => playerDevicesCommand(opts));

player
	.command("volume <percent>")
	.description("Set volume (0-100)")
	.action((percent) => playerVolumeCommand(percent));

player
	.command("shuffle <state>")
	.description("Toggle shuffle (on/off)")
	.action((state) => playerShuffleCommand(state));

player
	.command("repeat <state>")
	.description("Set repeat mode (off/track/context)")
	.action((state) => playerRepeatCommand(state));

// --- top ---

const top = program.command("top").description("Your top tracks and artists");

top
	.command("tracks")
	.description("Your most listened tracks")
	.option("-r, --range <range>", "Time range: short_term, medium_term, long_term", "medium_term")
	.option("-l, --limit <n>", "Number of results", "20")
	.option("--json", "Output as JSON", false)
	.action((opts) => topTracksCommand(opts));

top
	.command("artists")
	.description("Your most listened artists")
	.option("-r, --range <range>", "Time range: short_term, medium_term, long_term", "medium_term")
	.option("-l, --limit <n>", "Number of results", "20")
	.option("--json", "Output as JSON", false)
	.action((opts) => topArtistsCommand(opts));

// --- library ---

const library = program.command("library").description("Manage saved tracks");

library
	.command("list")
	.description("List saved tracks")
	.option("-l, --limit <n>", "Number of tracks", "20")
	.option("--offset <n>", "Offset for pagination", "0")
	.option("--json", "Output as JSON", false)
	.action((opts) => libraryListCommand(opts));

library
	.command("save")
	.description("Save tracks to library")
	.requiredOption("--tracks <ids>", "Comma-separated track IDs or URIs")
	.action((opts) => librarySaveCommand(opts));

library
	.command("remove")
	.description("Remove tracks from library")
	.requiredOption("--tracks <ids>", "Comma-separated track IDs or URIs")
	.action((opts) => libraryRemoveCommand(opts));

library
	.command("check")
	.description("Check if tracks are in library")
	.requiredOption("--tracks <ids>", "Comma-separated track IDs or URIs")
	.option("--json", "Output as JSON", false)
	.action((opts) => libraryCheckCommand(opts));

// --- track ---

const track = program.command("track").description("Track details and audio features");

track
	.command("get <id>")
	.description("Get track details")
	.option("--json", "Output as JSON", false)
	.action((id, opts) => trackGetCommand(id, opts));

track
	.command("features <id>")
	.description("Get audio features (energy, danceability, tempo, key, etc.)")
	.option("--json", "Output as JSON", false)
	.action((id, opts) => trackFeaturesCommand(id, opts));

// --- artist ---

const artist = program.command("artist").description("Artist details and discography");

artist
	.command("get <id>")
	.description("Get artist details")
	.option("--json", "Output as JSON", false)
	.action((id, opts) => artistGetCommand(id, opts));

artist
	.command("top-tracks <id>")
	.description("Get artist's top tracks")
	.option("-m, --market <code>", "Market/country code", "US")
	.option("--json", "Output as JSON", false)
	.action((id, opts) => artistTopTracksCommand(id, opts));

artist
	.command("albums <id>")
	.description("Get artist's albums")
	.option("-l, --limit <n>", "Number of albums", "20")
	.option("--json", "Output as JSON", false)
	.action((id, opts) => artistAlbumsCommand(id, opts));

artist
	.command("related <id>")
	.description("Get related artists")
	.option("--json", "Output as JSON", false)
	.action((id, opts) => artistRelatedCommand(id, opts));

// --- playlist ---

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
