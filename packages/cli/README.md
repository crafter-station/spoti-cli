# spoti-cli

Spotify Web API from your terminal. Search, recommend, create playlists. Built for AI agents.

## Install

Run it directly, no install:

```bash
bunx @crafter/spoti-cli --help
npx @crafter/spoti-cli --help
```

Or install globally:

```bash
bun add -g @crafter/spoti-cli
npm install -g @crafter/spoti-cli
```

Both give you the `spoti-cli` binary.

## Setup

1. Create a Spotify app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard/create)
2. Set redirect URI to `http://127.0.0.1:8888/callback` (copy it literally, Spotify rejects `localhost`, `https://`, and trailing slashes)
3. Authenticate:

```bash
spoti-cli auth --client-id YOUR_CLIENT_ID
```

## Usage

```bash
# Search tracks, artists, albums, playlists
spoti-cli search "Daft Punk" --type artist --json
spoti-cli search "Around the World" --type track --limit 5
spoti-cli search "lofi study" --type playlist

# Search types: track, artist, album, playlist

# Get recommendations from seeds
spoti-cli recommend --seed-genres electronic,house --energy 0.8 --limit 20 --json

# Create a playlist and follow it so it appears in playlist list
spoti-cli create "Late Night Electronics" --tracks URI1,URI2,URI3 --public
spoti-cli create "Scratchpad" --no-follow

# Manage playlists
spoti-cli playlist list --json
spoti-cli playlist list --mine --filter "rock" --limit 100
spoti-cli playlist get PLAYLIST_ID --json
spoti-cli playlist add PLAYLIST_ID --tracks URI1,URI2

# Current user
spoti-cli me --json
```

## Tunable Attributes

Fine-tune recommendations with audio features:

| Flag | Range | What it controls |
|------|-------|-----------------|
| `--energy` | 0.0–1.0 | Intensity |
| `--danceability` | 0.0–1.0 | Groove factor |
| `--valence` | 0.0–1.0 | Happy ↔ sad |
| `--tempo` | BPM | Speed |
| `--acousticness` | 0.0–1.0 | Acoustic ↔ electronic |
| `--instrumentalness` | 0.0–1.0 | Instrumental ↔ vocal |
| `--popularity` | 0–100 | Mainstream factor |

## AI Agents

Every command supports `--json`. Pair with Claude, GPT, or any LLM to generate playlists from natural language.

```
"Create a lo-fi playlist for studying"
→ AI maps mood → search seeds → recommend → create
→ Playlist on your Spotify
```

## Stack

Bun · TypeScript · Spotify Web API · OAuth2 PKCE

## License

MIT — [Crafter Station](https://github.com/crafter-station)
