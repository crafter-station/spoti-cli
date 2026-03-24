export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center px-6">
			<div className="mx-auto max-w-2xl text-center">
				<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1.5 text-sm text-neutral-400">
					<span className="size-2 rounded-full bg-green-500" />
					v0.1.0
				</div>

				<h1 className="mb-4 font-[family-name:var(--font-geist)] text-5xl font-bold tracking-tight md:text-6xl">
					Spotify from your{" "}
					<span className="text-green-500">terminal</span>
				</h1>

				<p className="mx-auto mb-10 max-w-lg text-lg text-neutral-400">
					Search tracks, get AI-powered recommendations, and create playlists.
					Built for developers and AI agents.
				</p>

				<div className="mb-12 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
					<div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-2.5">
						<span className="size-3 rounded-full bg-red-500/80" />
						<span className="size-3 rounded-full bg-yellow-500/80" />
						<span className="size-3 rounded-full bg-green-500/80" />
						<span className="ml-2 font-mono text-xs text-neutral-500">
							terminal
						</span>
					</div>
					<div className="space-y-3 p-4 text-left font-[family-name:var(--font-geist-mono)] text-sm">
						<p>
							<span className="text-green-500">$</span>{" "}
							<span className="text-neutral-300">bun add -g spoti-cli</span>
						</p>
						<p>
							<span className="text-green-500">$</span>{" "}
							<span className="text-neutral-300">
								spoti-cli auth --client-id YOUR_ID
							</span>
						</p>
						<p className="text-neutral-500">
							Opening browser for Spotify login...
						</p>
						<p className="text-neutral-500">Authenticated successfully!</p>
						<p className="mt-2">
							<span className="text-green-500">$</span>{" "}
							<span className="text-neutral-300">
								spoti-cli search &quot;Radiohead&quot; --json
							</span>
						</p>
						<p>
							<span className="text-green-500">$</span>{" "}
							<span className="text-neutral-300">
								spoti-cli recommend --seed-genres electronic --energy 0.8
							</span>
						</p>
						<p>
							<span className="text-green-500">$</span>{" "}
							<span className="text-neutral-300">
								spoti-cli create &quot;Deep Work Mix&quot; --tracks ...
							</span>
						</p>
						<p className="text-green-400">
							Playlist created: https://open.spotify.com/playlist/...
						</p>
					</div>
				</div>

				<div className="mb-16 grid gap-6 text-left md:grid-cols-3">
					<Feature
						title="Search"
						description="Find tracks, artists, and albums with flexible queries and filters."
					/>
					<Feature
						title="Recommend"
						description="Get recommendations by seeds with tunable attributes: energy, tempo, valence."
					/>
					<Feature
						title="Create"
						description="Create playlists and add tracks in one command. Returns the Spotify URL."
					/>
				</div>

				<div className="mb-16 rounded-lg border border-neutral-800 bg-neutral-900/50 p-8">
					<h2 className="mb-3 text-xl font-semibold">Built for AI agents</h2>
					<p className="mb-4 text-neutral-400">
						Every command supports{" "}
						<code className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-sm text-green-400">
							--json
						</code>{" "}
						output. Pair with Claude, GPT, or any LLM to create playlists from
						natural language.
					</p>
					<div className="overflow-hidden rounded border border-neutral-800 bg-neutral-950 p-4 text-left font-[family-name:var(--font-geist-mono)] text-sm">
						<p className="text-neutral-500">
							&quot;Create a lo-fi playlist for studying&quot;
						</p>
						<p className="mt-1 text-neutral-500">
							→ AI maps mood to seeds + attributes
						</p>
						<p className="text-neutral-500">
							→ spoti-cli search + recommend + create
						</p>
						<p className="text-green-400">→ Playlist on your Spotify</p>
					</div>
				</div>

				<footer className="border-t border-neutral-800 pt-8 pb-12 text-sm text-neutral-500">
					<p>
						Built by{" "}
						<a
							href="https://github.com/crafter-station"
							className="text-neutral-300 underline underline-offset-4 hover:text-green-500"
						>
							Crafter Station
						</a>
					</p>
					<p className="mt-2">
						<a
							href="https://github.com/crafter-station/spoti-cli"
							className="text-neutral-400 underline underline-offset-4 hover:text-green-500"
						>
							GitHub
						</a>
						{" · "}
						<a
							href="https://www.npmjs.com/package/spoti-cli"
							className="text-neutral-400 underline underline-offset-4 hover:text-green-500"
						>
							npm
						</a>
					</p>
				</footer>
			</div>
		</main>
	);
}

function Feature({
	title,
	description,
}: { title: string; description: string }) {
	return (
		<div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-5">
			<h3 className="mb-1.5 font-semibold text-green-500">{title}</h3>
			<p className="text-sm text-neutral-400">{description}</p>
		</div>
	);
}
