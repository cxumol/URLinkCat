function newRandomID() {
	let result = Math.random().toString(36).slice(-8);
	while (result.length < 8) {
		result = Math.random().toString(36).slice(-8);
	}
	return result;
}
export { newRandomID };
