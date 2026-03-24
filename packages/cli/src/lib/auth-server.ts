const PORT = 8888;

export function startAuthServer(): Promise<string> {
	return new Promise((resolve, reject) => {
		const server = Bun.serve({
			hostname: "127.0.0.1",
			port: PORT,
			fetch(req) {
				const url = new URL(req.url);
				if (url.pathname === "/callback") {
					const code = url.searchParams.get("code");
					const error = url.searchParams.get("error");

					if (error) {
						reject(new Error(`Auth failed: ${error}`));
						setTimeout(() => server.stop(), 100);
						return new Response(
							authPage("Authentication failed. You can close this tab.", true),
							{
								headers: { "Content-Type": "text/html" },
							},
						);
					}

					if (code) {
						resolve(code);
						setTimeout(() => server.stop(), 100);
						return new Response(
							authPage("Authentication successful! Return to your terminal."),
							{
								headers: { "Content-Type": "text/html" },
							},
						);
					}

					return new Response("Missing code", { status: 400 });
				}
				return new Response("Not found", { status: 404 });
			},
		});

		setTimeout(() => {
			server.stop();
			reject(new Error("Auth timeout after 120s"));
		}, 120_000);
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
