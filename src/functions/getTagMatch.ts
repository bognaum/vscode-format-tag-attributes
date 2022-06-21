import * as vsc from 'vscode';
import * as rawRE from "../regexp";

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
		offset = doc.offsetAt(pos),
		text = doc.getText();
	const 
		startOffset = getTagStartOffset(text, offset),
		baseIndent  = getBaseIndent(text, startOffset);
	if (text[startOffset] && text[startOffset + 1] !== "/") {
		tagRE.lastIndex = startOffset;
		const 
			m = text.match(tagRE),
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
			const
				tagStr = m[0],
				mm = tagStr.match(styleRE);
			let styleOpts = {};
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
					styleOpts = {
						range
					};
					if (quoted) {
						const 
							quoteType = quoted[0],
							contentStr = quoted.slice(1, -1);
						
						styleOpts = {
							...styleOpts,
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