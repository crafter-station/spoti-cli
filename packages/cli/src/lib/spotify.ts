import { readConfig, updateConfig } from "./config.js";

const BASE_URL = "https://api.spotify.com/v1";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

function explainError(status: number, body: string, path?: string): string {
	let message = body;
	try {
		const parsed = JSON.parse(body);
		message = parsed?.error?.message ?? body;
	} catch {}

	if (status === 403 && /insufficient client scope/i.test(message)) {
		return [
			`Spotify API error 403: Insufficient client scope.`,
			"",
			"Your token is missing permissions for this command.",
			"Run: spoti-cli auth --upgrade",
			"(Re-authenticates and grants playback, library, top, and history scopes.)",
		].join("\n");
	}

	if (status === 403) {
		return [
			`Spotify API error 403: ${message || "Forbidden"}.`,
			"",
			"Three common causes — check in this order:",
			"",
			"  1. Endpoint may be deprecated (Spotify removed many on 2026-02-11).",
			"     If you see this on a CLI you just installed, run: npm i -g @crafter/spoti-cli",
			"     to make sure you're on the latest version.",
			"",
			"  2. Development Mode app + your account isn't allowlisted.",
			"     Open https://developer.spotify.com/dashboard → your app →",
			"     Settings → User Management → add your Spotify account email.",
			"     (You're allowlisted automatically if you're the app owner.)",
			"",
			"  3. Redirect URI mismatch when you set up the app.",
			"     It must be EXACTLY http://127.0.0.1:8888/callback",
			"     (not localhost, not https, not a trailing slash).",
			"     If wrong, fix it in the dashboard, delete ~/.spoti-cli/config.json,",
			"     and re-run: spoti-cli auth --client-id <ID>",
			"",
			"Migration notes: https://developer.spotify.com/documentation/web-api/references/changes/february-2026",
		].join("\n");
	}

	if (status === 404) {
		return [
			`Spotify API error 404: ${message || "Not found"}.`,
			"",
			"The endpoint or resource doesn't exist. If this is a write command,",
			"the endpoint may have been removed in the Feb 2026 API update.",
			"Update the CLI: npm i -g @crafter/spoti-cli",
		].join("\n");
	}

	if (status === 401) {
		return [
			`Spotify API error 401: ${message || "Unauthorized"}.`,
			"",
			"Your token is invalid or revoked. Run: spoti-cli auth --upgrade",
		].join("\n");
	}

	if (status === 429) {
		return `Spotify API error 429: Rate limited. Wait a moment and retry.`;
	}

	const where = path ? ` (${path})` : "";
	return `Spotify API error ${status}${where}: ${message}`;
}

async function refreshAccessToken(): Promise<string> {
	const config = readConfig();
	if (!config.client_id || !config.refresh_token) {
		throw new Error("Not authenticated. Run: spoti-cli auth --client-id <ID>");
	}

	const res = await fetch(TOKEN_URL, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: config.refresh_token,
			client_id: config.client_id,
		}),
	});

	if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);

	const data = (await res.json()) as {
		access_token: string;
		refresh_token?: string;
		expires_in: number;
	};

	updateConfig({
		access_token: data.access_token,
		refresh_token: data.refresh_token ?? config.refresh_token,
		expires_at: Date.now() + data.expires_in * 1000,
	});

	return data.access_token;
}

async function getToken(): Promise<string> {
	const config = readConfig();
	if (!config.access_token) {
		throw new Error("Not authenticated. Run: spoti-cli auth --client-id <ID>");
	}

	if (config.expires_at && Date.now() > config.expires_at - 60_000) {
		return refreshAccessToken();
	}

	return config.access_token;
}

export async function spotify<T>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	const token = await getToken();
	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	if (res.status === 401) {
		const newToken = await refreshAccessToken();
		const retry = await fetch(`${BASE_URL}${path}`, {
			...options,
			headers: {
				Authorization: `Bearer ${newToken}`,
				"Content-Type": "application/json",
				...options.headers,
			},
		});
		if (!retry.ok) {
			const body = await retry.text();
			throw new Error(explainError(retry.status, body, path));
		}
		if (retry.status === 204) return {} as T;
		const retryText = await retry.text();
		if (!retryText) return {} as T;
		try {
			return JSON.parse(retryText) as T;
		} catch {
			return {} as T;
		}
	}

	if (!res.ok) {
		const body = await res.text();
		throw new Error(explainError(res.status, body, path));
	}

	if (res.status === 204) return {} as T;
	const text = await res.text();
	if (!text) return {} as T;
	try {
		return JSON.parse(text) as T;
	} catch {
		return {} as T;
	}
}
