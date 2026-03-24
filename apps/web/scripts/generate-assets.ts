import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const GREEN = "#1DB954";
const BLACK = "#000000";
const WHITE = "#FFFFFF";
const GRAY = "#737373";

const fontPath = join(import.meta.dirname, "..", "node_modules", "@resvg", "resvg-js");

async function loadFont(): Promise<ArrayBuffer> {
	const res = await fetch(
		"https://cdn.jsdelivr.net/fontsource/fonts/geist-mono@latest/latin-700-normal.woff"
	);
	return res.arrayBuffer();
}

async function loadFontRegular(): Promise<ArrayBuffer> {
	const res = await fetch(
		"https://cdn.jsdelivr.net/fontsource/fonts/geist-mono@latest/latin-400-normal.woff"
	);
	return res.arrayBuffer();
}

async function generateOG(
	width: number,
	height: number,
	filename: string,
	fontBold: ArrayBuffer,
	fontRegular: ArrayBuffer
) {
	const svg = await satori(
		{
			type: "div",
			props: {
				style: {
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					backgroundColor: BLACK,
					padding: "80px",
				},
				children: [
					{
						type: "div",
						props: {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "12px",
								marginBottom: "40px",
							},
							children: [
								{
									type: "div",
									props: {
										style: {
											width: "12px",
											height: "12px",
											borderRadius: "50%",
											backgroundColor: GREEN,
										},
									},
								},
								{
									type: "span",
									props: {
										style: {
											color: GRAY,
											fontSize: "24px",
											fontFamily: "Geist Mono",
											fontWeight: 400,
										},
										children: "v0.1.0",
									},
								},
							],
						},
					},
					{
						type: "div",
						props: {
							style: {
								display: "flex",
								flexDirection: "column",
								gap: "16px",
							},
							children: [
								{
									type: "span",
									props: {
										style: {
											color: GREEN,
											fontSize: "72px",
											fontFamily: "Geist Mono",
											fontWeight: 700,
											letterSpacing: "-0.03em",
											lineHeight: 1.1,
										},
										children: "spoti-cli",
									},
								},
								{
									type: "span",
									props: {
										style: {
											color: WHITE,
											fontSize: "48px",
											fontFamily: "Geist Mono",
											fontWeight: 700,
											letterSpacing: "-0.02em",
											lineHeight: 1.1,
										},
										children: "Spotify from your terminal",
									},
								},
							],
						},
					},
					{
						type: "div",
						props: {
							style: {
								display: "flex",
								marginTop: "40px",
								gap: "24px",
							},
							children: [
								{
									type: "span",
									props: {
										style: {
											color: GRAY,
											fontSize: "22px",
											fontFamily: "Geist Mono",
											fontWeight: 400,
										},
										children: "Search · Recommend · Create · Open",
									},
								},
							],
						},
					},
				],
			},
		},
		{
			width,
			height,
			fonts: [
				{ name: "Geist Mono", data: fontBold, weight: 700, style: "normal" },
				{ name: "Geist Mono", data: fontRegular, weight: 400, style: "normal" },
			],
		}
	);

	const resvg = new Resvg(svg, { fitTo: { mode: "width", value: width } });
	const png = resvg.render().asPng();

	const outPath = join(import.meta.dirname, "..", "public", filename);
	writeFileSync(outPath, png);
	console.log(`Generated ${filename} (${width}x${height})`);
}

async function generateFavicon(fontBold: ArrayBuffer) {
	const svg = await satori(
		{
			type: "div",
			props: {
				style: {
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: GREEN,
					borderRadius: "20%",
				},
				children: [
					{
						type: "span",
						props: {
							style: {
								color: BLACK,
								fontSize: "300px",
								fontFamily: "Geist Mono",
								fontWeight: 700,
							},
							children: "S",
						},
					},
				],
			},
		},
		{
			width: 512,
			height: 512,
			fonts: [
				{ name: "Geist Mono", data: fontBold, weight: 700, style: "normal" },
			],
		}
	);

	const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 512 } });
	const png512 = resvg.render().asPng();

	const sizes = [16, 32, 48];
	const buffers = await Promise.all(
		sizes.map((s) => sharp(Buffer.from(png512)).resize(s, s).png().toBuffer())
	);

	const icoPath = join(import.meta.dirname, "..", "src", "app", "favicon.ico");
	const pngPath = join(import.meta.dirname, "..", "public", "favicon.png");

	await sharp(Buffer.from(png512)).resize(32, 32).png().toFile(icoPath);
	await sharp(Buffer.from(png512)).resize(180, 180).png().toFile(pngPath);

	console.log("Generated favicon.ico + favicon.png");
}

async function main() {
	console.log("Loading fonts...");
	const [fontBold, fontRegular] = await Promise.all([
		loadFont(),
		loadFontRegular(),
	]);

	await generateOG(1200, 630, "og.png", fontBold, fontRegular);
	await generateOG(1200, 600, "og-twitter.png", fontBold, fontRegular);
	await generateFavicon(fontBold);

	console.log("Done!");
}

main();
