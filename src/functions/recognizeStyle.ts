import * as vsc from 'vscode';
import * as rawRE from "../regexp";
import Recognized from '../recognized.interface';
import {
	getBaseIndent,
	offsetRight,
	offsetLeft,
} from "./base";
const styleRE = new RegExp(rawRE.style, "y");

export default function recognizeStyle (tEditor: vsc.TextEditor, pos: vsc.Position) {
	const
		doc = tEditor.document,
		givenOffset = doc.offsetAt(pos),
		text = doc.getText();

	const startOffset = getTagStartOffset(text, givenOffset);
	if (-1 < startOffset) {
		styleRE.lastIndex = startOffset;
		const m = text.match(styleRE);
		if (m) {
			const endOffset = styleRE.lastIndex;
			if (startOffset <= givenOffset && givenOffset <= endOffset) {

				const 
					opts = tEditor.options,
					EOL  = ["", "\n", "\r\n"][doc.eol],
					TAB  = opts.insertSpaces && typeof opts.tabSize === "number" ? 
					" ".repeat(opts.tabSize) : "\t",
					baseIndent = getBaseIndent(doc.getText(), startOffset);

				const 
					range = new vsc.Range(doc.positionAt(startOffset), doc.positionAt(endOffset)),
					cssRulesStr = m.groups?.quoted.slice(1, -1) || "",
					quote = m.groups?.quoted[0] || "err",
					cssRulesArr = cssRulesStr.split(";").filter(v => v.match(/\w/)).map(v => v.trim()),
					isSplitted = cssRulesStr.includes(EOL);
				
				
				const st: Recognized = {
					isSplitted,
					range,
					split() {
						const propStr = offsetRight(
							cssRulesArr.join("; " + EOL + baseIndent),
							EOL, baseIndent, TAB
						);
						return (
							'style=' + quote + EOL +
							baseIndent + TAB + propStr + EOL+
							baseIndent + quote
						);
					},
					join() {
						const propStr = offsetLeft(
							cssRulesArr.join("; "),
							EOL, baseIndent, TAB
						);
						return (
							'style=' + quote + propStr + quote
						);
					},
					toggle() {
						return this.isSplitted ? this.join() : this.split();
					},
				};

				return st;
			}

		}
	} 
	return null;
}



function getTagStartOffset(text: string, givenOffset: number) {
	let i = givenOffset, v = "";
	while (text[i]) {
		if (text.startsWith("style", i)) {
			return i;
		}
		i --;
	}
	return -1;
}
