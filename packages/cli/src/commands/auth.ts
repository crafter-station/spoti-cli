import { REDIRECT_URI, startAuthServer } from "../lib/auth-server.js";
import { readConfig, updateConfig } from "../lib/config.js";

const SCOPES = [
	"playlist-modify-private",
	"playlist-modify-public",
	"playlist-read-private",
	"playlist-read-collaborative",
	"user-read-private",
	"user-read-email",
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

function printOnboarding() {
	const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
	const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
	const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
	const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
	console.error("");
	console.error(bold("Set up your Spotify app (60 seconds):"));
	console.error("");
	console.error(`  ${dim("1.")} Open ${cyan("https://developer.spotify.com/dashboard/create")}`);
	console.error(`  ${dim("2.")} Fill the form with these exact values:`);
	console.error("");
	console.error(`     ${dim("App name")}         ${green("spoti-cli")}            ${dim("(or anything)")}`);
	console.error(`     ${dim("App description")}  ${green("CLI access")}           ${dim("(or anything)")}`);
	console.error(`     ${dim("Redirect URI")}     ${green(REDIRECT_URI)}`);
	console.error(`     ${dim("APIs used")}        ${green("Web API")}              ${dim("(checkbox)")}`);
	console.error("");
	console.error(`  ${dim("3.")} Save → click ${bold("Settings")} → copy ${bold("Client ID")}`);
	console.error(`  ${dim("4.")} Run: ${green("spoti-cli auth --client-id <CLIENT_ID>")}`);
	console.error("");
	console.error(dim("Note: Spotify rejects 'localhost'. Use 127.0.0.1 verbatim."));
	console.error("");
}

export async function authCommand(clientId?: string, _upgrade = false) {
	const config = readConfig();
	const id = clientId ?? config.client_id;

	if (!id) {
		printOnboarding();
		process.exit(1);
	}

	updateConfig({ client_id: id });

	const codeVerifier = generateCodeVerifier();
	const codeChallenge = await generateCodeChallenge(codeVerifier);

	const authUrl = new URL("https://accounts.spotify.com/authorize");
	authUrl.searchParams.set("response_type", "code");
	authUrl.searchParams.set("client_id", id);
	const scopes = SCOPES;
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

	const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
	const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
	const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;

	console.log("");
	console.log(green("✓ Authenticated successfully"));
	console.log(dim(`  Granted scopes: ${scopes.length}`));
	console.log("");
	console.log(bold("First 403 error? Two common causes:"));
	console.log(`  ${dim("1.")} ${green("Insufficient client scope")} → run ${bold("spoti-cli auth --upgrade")}`);
	console.log(`  ${dim("2.")} ${green("Forbidden (dev mode)")} → add yourself as a test user in the dashboard:`);
	console.log(`     ${dim("https://developer.spotify.com/dashboard → your app → Settings → User Management")}`);
	console.log("");
	console.log(dim("Install the Claude skill for AI-powered playlists:"));
	console.log(dim("  npx skills add crafter-station/skills --skill spoti-cli"));
}
