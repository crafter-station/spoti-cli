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
						<span className="text-[#1DB954]">Full</span> Spotify from your terminal
					</h1>
					<p className="mt-8 max-w-xl font-[family-name:var(--font-geist)] text-lg leading-relaxed text-neutral-400">
						Playback control, personalization, library management, and playlists.
						22 commands. Built for developers and AI agents.
					</p>
				</div>

				<div className="mb-24">
					<h2 className="mb-6 font-[family-name:var(--font-geist-mono)] text-3xl font-bold tracking-tight text-white">
						AI Agent Skill
					</h2>
					<p className="mb-8 max-w-lg text-neutral-400">
						Install the skill to let your AI agent control Spotify from natural
						language, mood descriptions, or context-aware automation.
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
								<span className="text-violet-400">player now</span>{" "}
								<span className="text-neutral-500">--json</span>
							</p>
							<p className="text-neutral-600">
								{`{ "track": "De Musica Ligera", "artist": "Soda Stereo" }`}
							</p>
							<p className="mt-2">
								<span className="text-neutral-500">$</span>{" "}
								<span className="text-[#1DB954]">spoti-cli</span>{" "}
								<span className="text-violet-400">top tracks</span>{" "}
								<span className="text-neutral-500">--range short_term --json</span>
							</p>
							<p className="mt-2">
								<span className="text-neutral-500">$</span>{" "}
								<span className="text-[#1DB954]">spoti-cli</span>{" "}
								<span className="text-violet-400">player queue</span>{" "}
								<span className="text-amber-300">spotify:track:ID</span>
							</p>
							<p className="text-cyan-300">Added to queue</p>
						</div>
					</div>
				</div>

				<div className="mb-24 border-t border-neutral-800 pt-24">
					<div className="grid gap-px border border-neutral-800 bg-neutral-800 md:grid-cols-3">
						<Feature
							title="Playback"
							description="Play, pause, skip, queue, volume, shuffle, repeat. Full remote control."
						/>
						<Feature
							title="Personalization"
							description="Top tracks, top artists, listening history. Know your taste."
						/>
						<Feature
							title="Library"
							description="Save, remove, check liked tracks. Manage your collection."
						/>
						<Feature
							title="Search"
							description="Find tracks, artists, and albums with flexible queries and filters."
						/>
						<Feature
							title="Discovery"
							description="Artist info, top tracks, discography, recommendations by seeds."
						/>
						<Feature
							title="Playlists"
							description="Create, list, get, add tracks. Full playlist management."
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
						output. Pair with any LLM or agent runtime to control Spotify
						from natural language.
					</p>
					<div className="border border-neutral-800 bg-black p-5 font-[family-name:var(--font-geist-mono)] text-sm">
						<p className="text-neutral-500">
							&quot;Play something chill for coding&quot;
						</p>
						<p className="mt-2 text-neutral-600">
							→ top artists + search + filter history
						</p>
						<p className="text-neutral-600">
							→ spoti-cli player play + queue 3 tracks
						</p>
						<p className="text-cyan-300">→ Music playing in 1.5 seconds</p>
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
