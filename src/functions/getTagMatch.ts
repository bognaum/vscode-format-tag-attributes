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
	let 
		i = offset, 
		baseIndent = "", 
		startOffset = 0,
		endOffset = 0,
		v = "", vv = "", a = 0, b = 0;
	while (v = text[i]) {
		if (v === "<") {
			startOffset = i;
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
		tagRE.lastIndex = startOffset;
		const m = text.match(tagRE);
		endOffset = tagRE.lastIndex;
		if (m && offset <= tagRE.lastIndex) {
			const 
				range = new vsc.Range(doc.positionAt(startOffset), doc.positionAt(endOffset)),
				openingBr = m.groups?.A || "",
				tagName = m.groups?.tagName || "",
				attribStr = m.groups?.attribs || "",
				closingBr = m.groups?.B || "",
				attribArr = attribStr.match(attributesRE)?.map(v => v.trim()) || [],
				attribDetails = attribArr.map(v => v.match(attrRE)),
				spaceAfterName = m.groups?.C || "",
				wrapped = !!spaceAfterName.match("\n");
			
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
				wrapped,
				spaceAfterName,
			};
		}
	} else {
		// vsc.window.showWarningMessage("No begin");
	}
	return null;
}