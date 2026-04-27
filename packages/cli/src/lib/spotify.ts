import { readConfig, updateConfig } from "./config.js";

const BASE_URL = "https://api.spotify.com/v1";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

function explainError(status: number, body: string): string {
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
			"This usually means your Spotify app is in Development Mode and your",
			"account isn't added as a test user. Fix:",
			"  1. Open https://developer.spotify.com/dashboard",
			"  2. Click your app → Settings → User Management",
			"  3. Add your name + Spotify account email",
			"  4. Save and retry the command (no re-auth needed)",
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

	return `Spotify API error ${status}: ${message}`;
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
			throw new Error(explainError(retry.status, body));
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
		throw new Error(explainError(res.status, body));
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
