# @crafter/spoti-cli — agent guide

spoti-cli exposes the Spotify Web API as a terminal command: search, recommendations, playlist creation and management, playback control, saved-track library, listening history, and top tracks/artists. Every read command supports `--json`, so it is built for AI agents that map natural language ("make me a lo-fi study playlist") onto search -> recommend -> create pipelines, or that control playback and queueing on the user's devices. Use it whenever a task needs real Spotify data or side effects from a shell.

## Install

Run it directly, no install:

```bash
bunx @crafter/spoti-cli --help
npx @crafter/spoti-cli --help
```

Or globally (both provide the `spoti-cli` binary):

```bash
bun add -g @crafter/spoti-cli
npm install -g @crafter/spoti-cli
```

## Auth (required once, interactive)

1. Create a Spotify app at https://developer.spotify.com/dashboard/create with redirect URI exactly `http://127.0.0.1:8888/callback` and the Web API box checked.
2. `spoti-cli auth --client-id <CLIENT_ID>` — opens a browser for OAuth2 PKCE, runs a local callback server on 127.0.0.1:8888, and stores tokens in `~/.spoti-cli/config.json`. All scopes are granted in one pass; tokens auto-refresh afterward.

## Commands

- `auth` — `-c, --client-id <id>`; `-u, --upgrade` is a deprecated alias (auth already grants all scopes)
- `search <query>` — `-t, --type <track|artist|album|playlist>` (default track), `-l, --limit <n>` (default 10), `--json`
- `recommend` — `--seed-tracks <ids>`, `--seed-artists <ids>`, `--seed-genres <genres>`, `-l, --limit <n>` (default 20), targets `--energy`, `--danceability`, `--valence`, `--tempo`, `--popularity`, `--acousticness`, `--instrumentalness`, `--json`
- `create <name>` — `-d, --description <text>`, `--public`, `--no-follow`, `--tracks <uris>`, `-o, --open`, `--json`
- `me` — `--json`
- `history` — `-l, --limit <n>` (max 50, default 20), `--json`
- `player now|play|pause|next|prev|queue <uri>|devices|volume <0-100>|shuffle <on/off>|repeat <off/track/context>` — `play` takes `--uri <uri>` and `--device <id>`; `now`, `play`, `devices` support `--json`
- `top tracks|artists` — `-r, --range <short_term|medium_term|long_term>` (default medium_term), `-l, --limit <n>` (default 20), `--json`
- `library list|save|remove|check` — `list` takes `-l, --limit`, `--offset`, `--json`; `save`/`remove`/`check` require `--tracks <ids>`
- `track get <id>` / `track features <id>` — `--json`
- `artist get <id>` / `artist top-tracks <id>` (`-m, --market <code>`, default US) / `artist albums <id>` (`-l, --limit`) / `artist related <id>` — `--json`
- `playlist list` (`-l, --limit` max 500, `--filter <regex>`, `--mine`, `--json`) / `playlist get <id>` (`--json`) / `playlist add <id>` (requires `--tracks <uris>`)

## Usage patterns

1. Search then play on the active device:
   ```bash
   spoti-cli search "Around the World" --type track --limit 1 --json
   spoti-cli player play --uri spotify:track:<ID>
   ```
2. Build a playlist from taste + recommendations:
   ```bash
   spoti-cli top artists --range short_term --limit 5 --json
   spoti-cli recommend --seed-artists ID1,ID2 --energy 0.7 --limit 20 --json
   spoti-cli create "Late Night" --tracks URI1,URI2,URI3 --public --json
   ```
3. Queue without interrupting playback:
   ```bash
   spoti-cli player now --json
   spoti-cli player queue spotify:track:<ID>
   ```
4. Library maintenance:
   ```bash
   spoti-cli library check --tracks ID1,ID2 --json
   spoti-cli library save --tracks ID1,ID2
   ```

## Task -> command

| Task | Command |
|------|---------|
| Find a track/artist/album/playlist ID | `search "<q>" --type <t> --json` |
| What is playing right now | `player now --json` |
| Play/pause/skip/queue | `player play/pause/next/queue <uri>` |
| Move playback to another device | `player devices --json` then `player play --device <id>` |
| Generate tracks for a mood | `recommend --seed-genres ... --energy ... --json` |
| Make a playlist with tracks | `create "<name>" --tracks URI1,URI2 --json` |
| Add to an existing playlist | `playlist add <id> --tracks URI1,URI2` |
| User's taste profile | `top artists --range short_term --json` |
| Recently played | `history --limit 50 --json` |

## Common mistakes

- Wrong: `npm i -g spoti-cli` or `bun add -g spoti-cli` / Correct: `npm i -g @crafter/spoti-cli` (the unscoped name is not this package; the binary is still `spoti-cli`)
- Wrong: redirect URI `http://localhost:8888/callback` or `https://...` / Correct: `http://127.0.0.1:8888/callback` exactly (Spotify rejects `localhost`, `https`, trailing slashes, missing `/callback`)
- Wrong: running data commands before auth / Correct: `spoti-cli auth --client-id <id>` first; without a stored token every command fails, and auth itself is interactive (opens a browser), so it cannot complete in a headless/non-TTY session
- Wrong: parsing the human-readable `key: value | key: value` output / Correct: pass `--json` and parse JSON
- Wrong: treating a 403 as a scope bug / Correct: apps created after 2026-02-11 require Spotify Premium for the owner and cap at 5 authorized users; also add yourself under the app's Settings -> User Management
- Wrong: `playlist add` or `library save` without `--tracks` / Correct: `--tracks <ids>` is a required option on `save`, `remove`, `check`, and `playlist add`
- Note: 429 responses mean rate limiting, wait and retry; expired tokens refresh automatically from `~/.spoti-cli/config.json`

Docs: https://spoti-cli.crafter.run
