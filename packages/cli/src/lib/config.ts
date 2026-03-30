import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CONFIG_DIR = join(homedir(), ".spoti-cli");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export interface SpotiConfig {
	client_id?: string;
	access_token?: string;
	refresh_token?: string;
	expires_at?: number;
	scopes?: string[];
}

const LEGACY_SCOPES = [
	"playlist-modify-private",
	"playlist-modify-public",
	"user-read-private",
	"user-read-email",
];

export function requireScopes(needed: string[]) {
	const config = readConfig();
	const granted = config.scopes ?? LEGACY_SCOPES;
	const missing = needed.filter((s) => !granted.includes(s));
	if (missing.length > 0) {
		console.error(`This command requires additional permissions: ${missing.join(", ")}`);
		console.error("Run: spoti-cli auth --upgrade");
		process.exit(1);
	}
}

function ensureConfigDir() {
	if (!existsSync(CONFIG_DIR)) {
		mkdirSync(CONFIG_DIR, { recursive: true });
	}
}

export function readConfig(): SpotiConfig {
	ensureConfigDir();
	if (!existsSync(CONFIG_FILE)) return {};
	return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
}

export function writeConfig(config: SpotiConfig) {
	ensureConfigDir();
	writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function updateConfig(partial: Partial<SpotiConfig>) {
	const current = readConfig();
	writeConfig({ ...current, ...partial });
}

export function requireAuth(): SpotiConfig & {
	client_id: string;
	access_token: string;
} {
	const config = readConfig();
	if (!config.client_id || !config.access_token) {
		console.error("Not authenticated. Run: spoti-cli auth --client-id <ID>");
		process.exit(1);
	}
	return config as SpotiConfig & {
		client_id: string;
		access_token: string;
	};
}
