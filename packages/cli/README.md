# spoti-cli

Spotify Web API from your terminal. Search, recommend, create playlists. Built for AI agents.

## Install

```bash
bun add -g spoti-cli
```

## Setup

1. Create a Spotify app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard/create)
2. Set redirect URI to `http://localhost:8888/callback`
3. Authenticate:

```bash
spoti-cli auth --client-id YOUR_CLIENT_ID
```

## Usage

```bash
# Search tracks, artists, albums
spoti-cli search "Daft Punk" --type artist --json
spoti-cli search "Around the World" --type track --limit 5

# Get recommendations from seeds
spoti-cli recommend --seed-genres electronic,house --energy 0.8 --limit 20 --json

# Create a playlist
spoti-cli create "Late Night Electronics" --tracks URI1,URI2,URI3 --public

# Manage playlists
spoti-cli playlist list --json
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
