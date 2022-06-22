import * as vsc from 'vscode';
import * as rawRE from "../regexp";
import {
	getBaseIndent,
	getTagStartOffset,
} from "./base";

export default function recognizeAttribs(doc: vsc.TextDocument, range: vsc.Range) {
	const
		// baseIndent = getBaseIndent(doc.getText(), doc.offsetAt(range.start)),
		text = doc.getText(range),
		attributesRE = new RegExp(rawRE.attr, "g" );

	const 
		attribs = text.match(attributesRE) || [],
		splitted = text.split(attributesRE),
		spaces = splitted.filter(v => v.match(/^\s*$/)),
		isSplitted = spaces.some(v => v.match(/\n/));

	return {
		attribs,
		rest: splitted,
		isSplitted,
		joinInOneLine,
		joinInManyLines,
		join,
	}

	function joinInOneLine(eol: string) {
		return join(eol);
	}
	function joinInManyLines(baseIndent:string, tab: string) {
		return join(baseIndent + tab);
	}

	function join(joiner: string) {
		const all = [];
		for (const [k, v]of splitted.entries()) {
			const trimmed = v.trim();
			if (trimmed) {
				all.push(trimmed);
			}
			const attrib = attribs[k].trim()
			if (attrib) {
				all.push(attrib);
			}
		}
		return all.join(joiner);
	}


	/* function joinInOneLine() {
		let str = "";
		for (const [k, v]of splitted.entries()) {
			str += v.trim() + " " + (attribs[k] || "") + " ";
		}
		return str;
	}
	function joinInManyLines(baseIndent:string, tab: string) {
		const all = [];
		for (const [k, v]of splitted.entries()) {
			const trimmed = v.trim();
			if (trimmed) {
				all.push(trimmed);
			}
			const attrib = attribs[k].trim()
			if (attrib) {
				all.push(attrib);
			}
		}
		return all.join(baseIndent + tab);
	} */
}