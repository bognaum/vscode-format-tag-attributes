import * as vsc from 'vscode';
import * as rawRE from "../regexp";
import {
	getBaseIndent,
	getTagStartOffset,
} from "./base";

export default function recognizeTag(doc: vsc.TextDocument, pos: vsc.Position) {
	const
		givenOffset = doc.offsetAt(pos),
		text = doc.getText();

	const startOffset = getTagStartOffset(text, givenOffset);
	if (-1 < startOffset) {
		const tagRE = new RegExp(rawRE.tag , "y");
		tagRE.lastIndex = startOffset;
		const m = text.match(tagRE);
		if (m) {
			const endOffset = tagRE.lastIndex;
			if (startOffset <= givenOffset && givenOffset <= tagRE.lastIndex) {
				// const range = new vsc.Range(doc.positionAt(startOffset), doc.positionAt(endOffset));
				const attributesRE = new RegExp(rawRE.attr, "g" );
				const 
					tagStr = m[0],
					baseIndent  = getBaseIndent(text, startOffset),
					range = new vsc.Range(doc.positionAt(startOffset), doc.positionAt(endOffset)),
					openingBr = m.groups?.A || "",
					tagName = m.groups?.tagName || "",
					attribStr = m.groups?.attribs || "",
					closingBr = m.groups?.B || "",
					attribArr = attribStr.match(attributesRE)?.map(v => v.trim()) || [],
					spaceAfterName = m.groups?.C || "",
					splitted = !!spaceAfterName.match("\n");
				return {
					match: m,
					givenOffset,
					endOffset,
					startOffset,
					
					tagStr,
					baseIndent,
					range,
					openingBr,
					tagName,
					attribStr,
					closingBr,
					attribArr,
					spaceAfterName,
					splitted,
				};
			}
		}
	}
	return null;
}