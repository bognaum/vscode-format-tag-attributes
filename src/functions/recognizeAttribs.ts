import * as vsc from 'vscode';
import * as rawRE from "../regexp";
import Recognized from '../recognized.interface';
import {
	getBaseIndent,
	// getTagStartOffset,
} from "./base";

export default function recognizeAttribs(tEditor: vsc.TextEditor, range: vsc.Range) {
	const
		doc = tEditor.document,
		text = doc.getText(range),
		[givenStartOffset, givenEndOffset] = [range.start, range.end].map(doc.offsetAt),
		attrRE = new RegExp(rawRE.attr, "g"),
		attrXRE = new RegExp(rawRE.attrX, "");
		
	const 
		opts = tEditor.options,
		EOL  = ["", "\n", "\r\n"][doc.eol],
		TAB  = opts.insertSpaces && typeof opts.tabSize === "number" ? 
		" ".repeat(opts.tabSize) : "\t",
		baseIndent = getBaseIndent(doc.getText(), doc.offsetAt(range.start));
	
	const 
		m = text.match(attrRE),
		splitted = text.split(attrXRE),
		isSplitted = !!splitted.join("").includes(EOL);
	
	const atts = {
		str: text,
		arr: m || [],
		baseIndent: getBaseIndent(doc.getText(), givenStartOffset),
		range,
		isSplitted,
	};
	
	const recognized: Recognized = {
		isSplitted,
		range: atts.range,
		join() {
			return atts.arr.join(" ");
		},
		split() {
			return atts.arr.reduce((acc, v) => {
				return acc += EOL + baseIndent + TAB + v;
			}, "") + EOL + baseIndent;
		},
		toggle () {
			return this.isSplitted ? this.join() : this.split();
		},
	};
	
	return recognized;
}
