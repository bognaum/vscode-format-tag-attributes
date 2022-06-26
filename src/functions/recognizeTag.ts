import * as vsc from 'vscode';
import * as rawRE from "../regexp";
import Recognized from '../recognized.interface';
import {
	getBaseIndent,
	// getTagStartOffset,
} from "./base";

export default function recognizeTag(tEditor: vsc.TextEditor, pos: vsc.Position) {
	const
		doc = tEditor.document,
		givenOffset = doc.offsetAt(pos),
		text = doc.getText();

	const startOffset = getTagStartOffset(text, givenOffset);
	if (-1 < startOffset) {
		const tagRE = new RegExp(rawRE.tag , "y");
		tagRE.lastIndex = startOffset;
		const m = text.match(tagRE);
		if (m) {
			const endOffset = tagRE.lastIndex;
			if (startOffset <= givenOffset && givenOffset <= endOffset) {
				const 
					opts = tEditor.options,
					EOL  = [0, "\n", "\r\n"][doc.eol],
					TAB  = opts.insertSpaces && typeof opts.tabSize === "number" ? 
						" ".repeat(opts.tabSize) : "\t",
					baseIndent = getBaseIndent(doc.getText(), startOffset);
				const 
					attributesRE = new RegExp(rawRE.attr, "g" ),
					attributeRE  = new RegExp(rawRE.attrX, "" ),
					attribStr = m.groups?.attribs || "",
					isSplitted = !!attribStr.split(attributeRE).join("").match("\n");
				const t = {
					allTagStr: m[0],
					baseIndent: getBaseIndent(text, startOffset),
					range: new vsc.Range(doc.positionAt(startOffset), doc.positionAt(endOffset)),
					"<": m.groups?.A || "",
					tagName: m.groups?.tagName || "",
					attribs: {
						str: attribStr,
						arr: attribStr.match(attributesRE)?.map(v => v.trim()) || [],
					},
					">": m.groups?.B || "",
					isSplitted,
				};
				
				const recognized: Recognized = {
					isSplitted,
					range: t.range,
					getOneLineText() {
						const 
							attribStr = t.attribs.arr.join(" "),
							text = t["<"] + t.tagName + " " + attribStr + t[">"];
						return text;
					},
					getMultiLineText() {
						let text = t["<"] + t.tagName + EOL;
						for (const attr of t.attribs.arr) {
							text += baseIndent + TAB + attr + EOL;
						}
						text += baseIndent + t[">"];
						return text;
					},
				};
				return recognized;
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