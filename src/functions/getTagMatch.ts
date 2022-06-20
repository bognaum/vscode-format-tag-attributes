import * as vsc from 'vscode';
import * as RE from "../regexp";

export default function getTagMatch (doc: vsc.TextDocument, pos: vsc.Position) {
	const
		offset = doc.offsetAt(pos),
		text = doc.getText();
	let i = offset, v = "", a = 0, b = 0;
	while (v = text[i]) {
		if (v === "<") {
			a = i;
			break;
		}
		i --;
	}
	if (v && text[i + 1] !== "/") {
		const tagRE = RE.tag;
		tagRE.lastIndex = i;
		// console.log(`text.slice(i) >>`, text.slice(i));
		const 
			m = text.match(tagRE),
			startOffset = a,
			endOffset = b = tagRE.lastIndex,
			range = new vsc.Range(doc.positionAt(a), doc.positionAt(b));
		if (m && offset <= tagRE.lastIndex) {
			const [tagStr, openedBrAndSpace, tagName, attribStr, noUsed, closedBr] = m;
			const 
				attribs = (attribStr || "").match(RE.attribs) || [],
				attribDetails = attribs.map(v => v.match(RE.attrib));
			
			return {
				match: m,
				range,
				startOffset,
				endOffset,
				tagStr,
				openedBrAndSpace, 
				tagName, 
				attribStr, 
				attribs, 
				attribDetails,
				attribCount: attribs.length,
				closedBr,
				givenDoc: doc,
				givenPos: pos,
				givenOffset: offset,
			};
		}
	} else {
		// vsc.window.showWarningMessage("No begin");
	}
	return null;
}