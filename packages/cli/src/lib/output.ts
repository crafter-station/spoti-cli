export function output(data: unknown, json: boolean) {
	if (json) {
		console.log(JSON.stringify(data, null, 2));
	} else if (Array.isArray(data)) {
		for (const item of data) {
			printItem(item);
		}
	} else {
		printItem(data);
	}
}

function printItem(item: Record<string, unknown>) {
	const parts: string[] = [];
	for (const [key, value] of Object.entries(item)) {
		if (value !== undefined && value !== null) {
			parts.push(`${key}: ${value}`);
		}
	}
	console.log(parts.join(" | "));
}
