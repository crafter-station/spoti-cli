export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center bg-black px-6 pt-32 pb-16">
			<nav className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-neutral-800 bg-black/80 px-8 py-4 backdrop-blur-sm">
				<span className="font-[family-name:var(--font-geist-mono)] text-sm font-bold tracking-tight text-white">
					spoti-cli
				</span>
				<div className="flex gap-8 font-[family-name:var(--font-geist-mono)] text-sm text-neutral-400">
					<a
						href="https://github.com/crafter-station/spoti-cli"
						className="transition-colors hover:text-white"
					>
						GitHub
					</a>
					<a
						href="https://www.npmjs.com/package/@crafter/spoti-cli"
						className="transition-colors hover:text-white"
					>
						npm
					</a>
				</div>
			</nav>

			<div className="mx-auto max-w-3xl">
				<div className="mb-12 pt-16">
					<h1 className="font-[family-name:var(--font-geist-mono)] text-6xl font-bold leading-[1.05] tracking-tight text-white md:text-8xl">
						<span className="text-[#1DB954]">Spotify</span> from your terminal
					</h1>
					<p className="mt-8 max-w-xl font-[family-name:var(--font-geist)] text-lg leading-relaxed text-neutral-400">
						Search tracks, get recommendations, and create playlists. Built for
						developers and AI agents.
					</p>
				</div>

				<div className="mb-24">
					<h2 className="mb-6 font-[family-name:var(--font-geist-mono)] text-3xl font-bold tracking-tight text-white">
						Agent Skill
					</h2>
					<p className="mb-8 max-w-lg text-neutral-400">
						Install the skill to let your AI agent create playlists from natural
						language, mood descriptions, or your Obsidian vault.
					</p>
					<div className="border border-neutral-800 bg-black p-5 font-[family-name:var(--font-geist-mono)] text-sm">
						<p>
							<span className="text-neutral-500">$</span>{" "}
							<span className="text-white">
								npx skills add crafter-station/skills --skill spoti-cli
							</span>
						</p>
					</div>
				</div>

				<div className="mb-24 border-t border-neutral-800 pt-24">
					<div className="overflow-hidden border border-neutral-800">
						<div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-2.5">
							<span className="size-2.5 rounded-full bg-neutral-600" />
							<span className="size-2.5 rounded-full bg-neutral-600" />
							<span className="size-2.5 rounded-full bg-neutral-600" />
							<span className="ml-2 font-[family-name:var(--font-geist-mono)] text-xs text-neutral-600">
								terminal
							</span>
						</div>
						<div className="space-y-2.5 bg-black p-5 font-[family-name:var(--font-geist-mono)] text-sm">
							<p>
								<span className="text-neutral-500">$</span>{" "}
								<span className="text-amber-400">bun</span>{" "}
								<span className="text-white">add -g</span>{" "}
								<span className="text-[#1DB954]">@crafter/spoti-cli</span>
							</p>
							<p>
								<span className="text-neutral-500">$</span>{" "}
								<span className="text-[#1DB954]">spoti-cli</span>{" "}
								<span className="text-violet-400">auth</span>{" "}
								<span className="text-neutral-500">--client-id</span>{" "}
								<span className="text-amber-300">YOUR_ID</span>
							</p>
							<p className="text-neutral-600">
								Opening browser for Spotify login...
							</p>
							<p className="text-cyan-300">Authenticated successfully!</p>
							<p className="mt-4">
								<span className="text-neutral-500">$</span>{" "}
								<span className="text-[#1DB954]">spoti-cli</span>{" "}
								<span className="text-violet-400">search</span>{" "}
								<span className="text-amber-300">&quot;Radiohead&quot;</span>{" "}
								<span className="text-neutral-500">--json</span>
							</p>
							<p>
								<span className="text-neutral-500">$</span>{" "}
								<span className="text-[#1DB954]">spoti-cli</span>{" "}
								<span className="text-violet-400">recommend</span>{" "}
								<span className="text-neutral-500">--seed-genres</span>{" "}
								<span className="text-amber-300">electronic</span>{" "}
								<span className="text-neutral-500">--energy</span>{" "}
								<span className="text-amber-300">0.8</span>
							</p>
							<p>
								<span className="text-neutral-500">$</span>{" "}
								<span className="text-[#1DB954]">spoti-cli</span>{" "}
								<span className="text-violet-400">create</span>{" "}
								<span className="text-amber-300">
									&quot;Deep Work Mix&quot;
								</span>{" "}
								<span className="text-neutral-500">--tracks ... --open</span>
							</p>
							<p className="text-cyan-300">
								Playlist created: https://open.spotify.com/playlist/...
							</p>
						</div>
					</div>
				</div>

				<div className="mb-24 border-t border-neutral-800 pt-24">
					<div className="grid gap-px border border-neutral-800 bg-neutral-800 md:grid-cols-3">
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
							description="Create playlists and add tracks in one command. Opens in Spotify."
						/>
					</div>
				</div>

				<div className="mb-24 border-t border-neutral-800 pt-24">
					<h2 className="mb-6 font-[family-name:var(--font-geist-mono)] text-3xl font-bold tracking-tight text-white">
						Built for AI agents
					</h2>
					<p className="mb-8 max-w-lg text-neutral-400">
						Every command supports{" "}
						<code className="border border-neutral-800 bg-neutral-900 px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-sm text-white">
							--json
						</code>{" "}
						output. Pair with Claude, GPT, or any LLM to create playlists from
						natural language.
					</p>
					<div className="border border-neutral-800 bg-black p-5 font-[family-name:var(--font-geist-mono)] text-sm">
						<p className="text-neutral-500">
							&quot;Create a lo-fi playlist for studying&quot;
						</p>
						<p className="mt-2 text-neutral-600">
							→ AI maps mood to seeds + attributes
						</p>
						<p className="text-neutral-600">
							→ spoti-cli search + recommend + create
						</p>
						<p className="text-cyan-300">→ Playlist on your Spotify</p>
					</div>
				</div>

				<footer className="border-t border-neutral-800 pt-8 font-[family-name:var(--font-geist-mono)] text-sm text-neutral-600">
					<p>
						Built by{" "}
						<a
							href="https://crafterstation.com"
							className="text-neutral-400 transition-colors hover:text-white"
						>
							Crafter Station
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
		<div className="bg-black p-6">
			<h3 className="mb-2 font-[family-name:var(--font-geist-mono)] text-sm font-bold uppercase tracking-widest text-white">
				{title}
			</h3>
			<p className="text-sm leading-relaxed text-neutral-500">{description}</p>
		</div>
	);
}
