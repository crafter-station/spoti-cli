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

export function requireScopes(needed: string[]) {
	const config = readConfig();
	if (!config.scopes) {
		console.error("Your token is from an older version. Re-authenticate to get full permissions:");
		console.error("  spoti-cli auth --client-id <ID>");
		process.exit(1);
	}
	const missing = needed.filter((s) => !config.scopes?.includes(s));
	if (missing.length > 0) {
		console.error(`This command requires additional permissions: ${missing.join(", ")}`);
		console.error("Run: spoti-cli auth --client-id <ID>  (re-authenticates with full scopes)");
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
