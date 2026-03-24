import { createServer } from "node:http";

const PORT = 8888;

export function startAuthServer(): Promise<string> {
	return new Promise((resolve, reject) => {
		const connections = new Set<import("node:net").Socket>();
		const server = createServer((req, res) => {
			const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);

			if (url.pathname === "/callback") {
				const code = url.searchParams.get("code");
				const error = url.searchParams.get("error");

				if (error) {
					res.writeHead(200, { "Content-Type": "text/html" });
					res.end(authPage("Authentication failed. You can close this tab.", true));
					reject(new Error(`Auth failed: ${error}`));
					setTimeout(forceClose, 100);
					return;
				}

				if (code) {
					res.writeHead(200, { "Content-Type": "text/html" });
					res.end(authPage("Authentication successful! Return to your terminal."));
					resolve(code);
					setTimeout(forceClose, 100);
					return;
				}

				res.writeHead(400);
				res.end("Missing code");
				return;
			}

			res.writeHead(404);
			res.end("Not found");
		});

		server.on("connection", (conn) => {
			connections.add(conn);
			conn.on("close", () => connections.delete(conn));
		});

		const forceClose = () => {
			clearTimeout(timeout);
			for (const conn of connections) conn.destroy();
			server.close();
			server.unref();
		};

		server.listen(PORT, "127.0.0.1");

		const timeout = setTimeout(() => {
			forceClose();
			reject(new Error("Auth timeout after 120s"));
		}, 120_000);
		timeout.unref();
	});
}

function authPage(message: string, isError = false): string {
	const color = isError ? "#ef4444" : "#22c55e";
	return `<!DOCTYPE html>
<html>
<head><title>spoti-cli</title></head>
<body style="font-family:system-ui;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#0a0a0a;color:#fafafa">
<div style="text-align:center">
<h1 style="color:${color}">${message}</h1>
<p style="color:#888">spoti-cli</p>
</div>
</body>
</html>`;
}

export const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
