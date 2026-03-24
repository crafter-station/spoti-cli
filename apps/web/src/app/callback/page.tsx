"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CallbackContent() {
	const params = useSearchParams();
	const code = params.get("code");
	const error = params.get("error");

	if (error) {
		return (
			<div className="text-center">
				<div className="mb-4 text-6xl">✕</div>
				<h1 className="mb-2 text-2xl font-bold text-red-500">
					Authentication Failed
				</h1>
				<p className="text-neutral-400">{error}</p>
			</div>
		);
	}

	if (code) {
		return (
			<div className="text-center">
				<div className="mb-4 text-6xl">✓</div>
				<h1 className="mb-2 text-2xl font-bold text-green-500">
					Authentication Successful
				</h1>
				<p className="text-neutral-400">You can close this tab and return to your terminal.</p>
			</div>
		);
	}

	return (
		<div className="text-center">
			<h1 className="mb-2 text-2xl font-bold">Waiting for authentication...</h1>
			<p className="text-neutral-400">
				If nothing happens, return to your terminal.
			</p>
		</div>
	);
}

export default function CallbackPage() {
	return (
		<main className="flex min-h-screen items-center justify-center">
			<Suspense
				fallback={
					<p className="text-neutral-400">Loading...</p>
				}
			>
				<CallbackContent />
			</Suspense>
		</main>
	);
}
