import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
});

export const metadata: Metadata = {
	title: "spoti-cli — Spotify from your terminal",
	description:
		"A CLI tool to search, recommend, and create Spotify playlists from the command line. Built for AI agents and developers.",
	openGraph: {
		title: "spoti-cli",
		description: "Spotify playlists from your terminal",
		type: "website",
		images: [{ url: "/og.png", width: 1200, height: 630 }],
	},
	twitter: {
		card: "summary_large_image",
		title: "spoti-cli",
		description: "Spotify playlists from your terminal",
		images: ["/og-twitter.png"],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${geist.variable} ${geistMono.variable} bg-black text-white antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
