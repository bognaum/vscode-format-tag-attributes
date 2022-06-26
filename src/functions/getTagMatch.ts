import * as vsc from 'vscode';
import * as rawRE from "../regexp";
import {
	getBaseIndent,
} from "./base";

for (const i in rawRE) {
	// console.log(i, new RegExp(rawRE[i])); //Ёбаный тайпскрипт ругается
}
const 
	styleRE      = new RegExp(rawRE.style, ""),
	tagRE        = new RegExp(rawRE.tag , "y"),
	attrRE       = new RegExp(rawRE.attr, ""),
	attributesRE = new RegExp(rawRE.attr, "g" );

export default function getTagMatch (doc: vsc.TextDocument, pos: vsc.Position) {
	const
		givenOffset = doc.offsetAt(pos),
		text = doc.getText();

	const startOffset = getTagStartOffset(text, givenOffset);
	if (-1 < startOffset) {
		tagRE.lastIndex = startOffset;
		const m = text.match(tagRE);
		if (m) {
			const endOffset = tagRE.lastIndex;
			if (startOffset <= givenOffset && givenOffset <= tagRE.lastIndex) {
				const 
					baseIndent  = getBaseIndent(text, startOffset),
					range = new vsc.Range(doc.positionAt(startOffset), doc.positionAt(endOffset)),
					openingBr = m.groups?.A || "",
					tagName = m.groups?.tagName || "",
					attribStr = m.groups?.attribs || "",
					closingBr = m.groups?.B || "",
					aroundAttribs = attribStr.split(attrRE),
					attribArr = attribStr.match(attributesRE)?.map(v => v.trim()) || [],
					attribDetails = attribArr.map(v => v.match(attributesRE)),
					spaces = aroundAttribs.filter(v => v.match(/^\s*$/)),
					splitted = spaces.some(v => v.match(/\n/));
				const
					tagStr = m[0],
					mm = tagStr.match(styleRE);
				let styleProps = {};
					if (mm) {
						const
							styleAttrStr = mm[0],
							styleStartOffset = startOffset + (mm.index || 0),
							attrLength = styleAttrStr.length,
							styleEndOffset = styleStartOffset + attrLength,
							range = new vsc.Range(
								doc.positionAt(styleStartOffset), 
								doc.positionAt(styleEndOffset)
							),
							quoted = mm.groups?.quoted;
						styleProps = {
							range
						};
						if (quoted) {
							const 
								quoteType = quoted[0],
								contentStr = quoted.slice(1, -1);
							
							styleProps = {
								...styleProps,
								quoteType,
								contentStr,
							};
						}
							
					}
				
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
					givenOffset,
					baseIndent,
					splitted,
				};
			}

		}
	} 
	return null;
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
