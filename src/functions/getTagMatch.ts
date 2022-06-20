import * as vsc from 'vscode';
import * as rawRE from "../regexp";

for (const i in rawRE) {
	// console.log(i, new RegExp(rawRE[i])); //Ёбаный тайпскрипт ругается
}
const 
	tagRE        = new RegExp(rawRE.tag , "y"),
	attrRE       = new RegExp(rawRE.attr, ""),
	attributesRE = new RegExp(rawRE.attr, "g" );

export default function getTagMatch (doc: vsc.TextDocument, pos: vsc.Position) {
	const
		offset = doc.offsetAt(pos),
		text = doc.getText();
	let i = offset, baseIndent = "", v = "", vv = "", a = 0, b = 0;
	while (v = text[i]) {
		if (v === "<") {
			a = i;
			break;
		}
		i --;
	}
	while (vv = text[i]) {
		if (vv === "\n") {
			break;
		}
		i --;
	}
	i += 1;
	while (vv = text[i]) {
		if (![" ", "\t"].includes(vv)) {
			break;
		}
		baseIndent += vv;
		i ++;
	}
	if (v && text[a + 1] !== "/") {
		tagRE.lastIndex = a;
		// console.log(`text.slice(i) >>`, text.slice(i));
		const 
			m = text.match(tagRE),
			startOffset = a,
			endOffset = b = tagRE.lastIndex,
			range = new vsc.Range(doc.positionAt(a), doc.positionAt(b));
		if (m && offset <= tagRE.lastIndex) {
			// const [tagStr, openedBrAndSpace, tagName, attribStr, noUsed, closedBr] = m;
			// const {tagName = "", attribs = ""} = m.groups;

			const 
				openingBr = m.groups?.A || "",
				tagName = m.groups?.tagName || "",
				attribStr = m.groups?.attribs || "",
				closingBr = m.groups?.B || "",
				attribArr = attribStr.match(attributesRE) || [],
				attribDetails = attribArr.map(v => v.match(attrRE));
			
			return {
				match: m,
				range,
				startOffset,
				endOffset,
				tagStr: m[0],
				"<": openingBr, 
				tagName, 
				attribStr, 
				attribArr,
				attribDetails,
				attribCount: attribArr.length,
				">": closingBr,
				givenDoc: doc,
				givenPos: pos,
				givenOffset: offset,
				baseIndent,
			};
		}
	} else {
		// vsc.window.showWarningMessage("No begin");
	}
	return null;
}