# spoti-cli

Spotify Web API from your terminal. Playback control, personalization, library management, and playlists. Built for AI agents.

> **v0.6.0** — Migrated to the Feb 2026 Spotify API surface (`/me/playlists`, `/playlists/{id}/items`, `/me/library`). Apps created after 2026-02-11 require this version. Older versions return `403 Forbidden` on every write call.

## Install

```bash
bun add -g @crafter/spoti-cli
```

## Setup

1. Create a Spotify app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard/create)
   - Set redirect URI to `http://127.0.0.1:8888/callback` — copy this **literally**. Spotify rejects `localhost`, `https://`, trailing slashes, and missing `/callback`.
   - Check **Web API**
   - Apps created after 2026-02-11 require **Spotify Premium** for the owner and are limited to 5 authorized users. The owner is allowlisted automatically.
2. Authenticate:

```bash
spoti-cli auth --client-id YOUR_CLIENT_ID
```

For playback, library, and personalization commands:

```bash
spoti-cli auth --upgrade
```

## Commands

### Playback Control

```bash
spoti-cli player now --json              # What's playing
spoti-cli player play --uri spotify:track:ID  # Play a track
spoti-cli player pause                   # Pause
spoti-cli player next                    # Skip
spoti-cli player prev                    # Previous
spoti-cli player queue spotify:track:ID  # Add to queue
spoti-cli player devices --json          # List devices
spoti-cli player volume 75               # Set volume
spoti-cli player shuffle on              # Toggle shuffle
spoti-cli player repeat track            # Set repeat mode
```

### Search & Discovery

```bash
spoti-cli search "Daft Punk" --type artist --json
spoti-cli search "Around the World" --type track --limit 5
spoti-cli recommend --seed-genres electronic --energy 0.8 --limit 20 --json
```

### Personalization

```bash
spoti-cli top tracks --range short_term --limit 10 --json   # Last 4 weeks
spoti-cli top artists --range medium_term --limit 10 --json # Last 6 months
spoti-cli history --limit 20 --json                         # Recently played
```

### Library

```bash
spoti-cli library list --limit 20 --json
spoti-cli library save --tracks ID1,ID2
spoti-cli library remove --tracks ID1,ID2
spoti-cli library check --tracks ID1,ID2 --json
```

### Track & Artist Info

```bash
spoti-cli track get ID --json
spoti-cli artist get ID --json
spoti-cli artist top-tracks ID --market US --json
spoti-cli artist albums ID --limit 10 --json
```

### Playlists

```bash
spoti-cli create "Late Night" --tracks URI1,URI2 --public --json
spoti-cli playlist list --json
spoti-cli playlist get ID --json
spoti-cli playlist add ID --tracks URI1,URI2
```

### Account

```bash
spoti-cli me --json
```

## Tunable Attributes

Fine-tune recommendations with audio features:

| Flag | Range | What it controls |
|------|-------|-----------------|
| `--energy` | 0.0-1.0 | Intensity |
| `--danceability` | 0.0-1.0 | Groove factor |
| `--valence` | 0.0-1.0 | Happy to sad |
| `--tempo` | BPM | Speed |
| `--acousticness` | 0.0-1.0 | Acoustic to electronic |
| `--instrumentalness` | 0.0-1.0 | Instrumental to vocal |
| `--popularity` | 0-100 | Mainstream factor |

## Real World Use Cases

### Voice-Controlled DJ

Build a voice-controlled Spotify DJ with real-time STT and AI intent parsing. spoti-cli handles all Spotify operations while the voice layer handles transcription and responses.

```
"Play Soda Stereo"  -> search -> play (1.5s)
"Pause"             -> pause       (0.7s)
"Move to TV"        -> transfer    (0.5s)
```

### AI Playlist Curation

Analyze listening patterns and generate playlists from natural language:

```bash
spoti-cli top artists --range short_term --json     # Taste profile
spoti-cli history --limit 50 --json                 # Filter out recent
spoti-cli artist top-tracks ARTIST_ID --json        # Deep cuts
spoti-cli create "Deep Cuts" --tracks URI1,... --json
```

### Smart Auto-Queue

Queue tracks based on current vibe without interrupting playback:

```bash
spoti-cli player now --json                          # Current context
spoti-cli top artists --range short_term --json      # Taste seeds
spoti-cli search "artist" --type track --limit 20 --json
spoti-cli player queue spotify:track:ID              # Add to queue
```

### Multi-Device Control

Move playback between devices seamlessly:

```bash
spoti-cli player devices --json
spoti-cli player play --device DEVICE_ID
spoti-cli player volume 30
```

## AI Agents

Every command supports `--json`. Pair with Claude, GPT, or any LLM for natural language music control.

Install the [`spoti-cli` skill](skills/spoti-cli/SKILL.md) so your agent knows the commands, the mood vocabulary, and the vault-aware playlist flow:

```bash
npx skills add crafter-station/spoti-cli
```

Works with Claude Code, Cursor, Copilot, and [10+ more agents](https://github.com/vercel-labs/add-skill#available-agents).

## Stack

Bun, TypeScript, Spotify Web API, OAuth2 PKCE

## License

MIT -- [Crafter Station](https://github.com/crafter-station)
