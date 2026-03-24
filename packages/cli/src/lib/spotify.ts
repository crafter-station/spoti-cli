import { readConfig, updateConfig } from "./config.js";

const BASE_URL = "https://api.spotify.com/v1";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

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
		if (!retry.ok) throw new Error(`Spotify API error: ${retry.status}`);
		return retry.json() as T;
	}

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Spotify API error ${res.status}: ${body}`);
	}

	if (res.status === 204) return {} as T;
	return res.json() as T;
}
