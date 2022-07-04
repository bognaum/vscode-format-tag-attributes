export {
	getBaseIndent,
	offsetRight,
	offsetLeft,
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

function offsetRight(text: string, eol:string, baseInd: string, tab: string): string {
	return text.replace(new RegExp(eol + baseInd, "g"), eol + baseInd + tab);
}

function offsetLeft(text: string, eol:string, baseInd: string, tab: string): string {
	return text.replace(new RegExp(eol + baseInd + tab, "g"), eol + baseInd);
}