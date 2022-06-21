export {
	getBaseIndent,
	getTagStartOffset,
};

function getBaseIndent(text: string, offset: number) {
	let i = offset, v = "", baseIndent = "";
	while (v = text[i]) {
		if (v === "\n") {
			break;
		}
		i --;
	}
	i += 1;
	while (v = text[i]) {
		if (![" ", "\t"].includes(v)) {
			break;
		}
		baseIndent += v;
		i ++;
	}
	return baseIndent;
}

function getTagStartOffset(text: string, givenOffset: number) {
	let i = givenOffset, v = "";
	while (v = text[i]) {
		if (v === "<") {
			return i;
		}
		i --;
	}
	return -1;
}