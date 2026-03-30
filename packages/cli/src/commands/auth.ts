import { REDIRECT_URI, startAuthServer } from "../lib/auth-server.js";
import { readConfig, updateConfig } from "../lib/config.js";

const BASE_SCOPES = [
	"playlist-modify-private",
	"playlist-modify-public",
	"user-read-private",
	"user-read-email",
];

const FULL_SCOPES = [
	...BASE_SCOPES,
	"user-read-playback-state",
	"user-modify-playback-state",
	"user-read-currently-playing",
	"user-top-read",
	"user-library-read",
	"user-library-modify",
	"user-read-recently-played",
];

function generateCodeVerifier(): string {
	const array = new Uint8Array(64);
	crypto.getRandomValues(array);
	return btoa(String.fromCharCode(...array))
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.slice(0, 128);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(verifier);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return btoa(String.fromCharCode(...new Uint8Array(digest)))
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
}

export async function authCommand(clientId?: string, upgrade = false) {
	const config = readConfig();
	const id = clientId ?? config.client_id;

	if (!id) {
		console.error("Client ID required. Run: spoti-cli auth --client-id <ID>");
		console.error("Get one at: https://developer.spotify.com/dashboard/create");
		process.exit(1);
	}

	updateConfig({ client_id: id });

	const codeVerifier = generateCodeVerifier();
	const codeChallenge = await generateCodeChallenge(codeVerifier);

	const authUrl = new URL("https://accounts.spotify.com/authorize");
	authUrl.searchParams.set("response_type", "code");
	authUrl.searchParams.set("client_id", id);
	const scopes = upgrade
		? [...new Set([...(config.scopes ?? BASE_SCOPES), ...FULL_SCOPES])]
		: FULL_SCOPES;
	authUrl.searchParams.set("scope", scopes.join(" "));
	authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
	authUrl.searchParams.set("code_challenge_method", "S256");
	authUrl.searchParams.set("code_challenge", codeChallenge);

	console.log("Opening browser for Spotify login...");
	console.log(`If it doesn't open, visit: ${authUrl.toString()}`);

	const open = (await import("open")).default;
	await open(authUrl.toString());

	const code = await startAuthServer();

	console.log("Exchanging code for tokens...");

	const res = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: REDIRECT_URI,
			client_id: id,
			code_verifier: codeVerifier,
		}),
	});

	if (!res.ok) {
		const err = await res.text();
		console.error(`Token exchange failed: ${err}`);
		process.exit(1);
	}

	const data = (await res.json()) as {
		access_token: string;
		refresh_token: string;
		expires_in: number;
	};

	updateConfig({
		access_token: data.access_token,
		refresh_token: data.refresh_token,
		expires_at: Date.now() + data.expires_in * 1000,
		scopes,
	});

	console.log("Authenticated successfully!");
	console.log("");
	console.log("Install the Claude skill for AI-powered playlists:");
	console.log("  npx skills add crafter-station/skills --skill spoti-cli");
}
