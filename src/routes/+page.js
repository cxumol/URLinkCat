export const ssr = false;

export async function load({ fetch }) {
	const res = await fetch(`/data_default.json`);
	const data = await res.json();
	return data;
}
