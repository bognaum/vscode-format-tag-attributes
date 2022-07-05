import * as vsc from 'vscode';
import * as rawRE from "../regexp";
import Recognized from '../recognized.interface';
import recognizeStyle from './recognizeStyle';

const 
	tagRE   = new RegExp(rawRE.tag,   "y"),
	styleRE = new RegExp(rawRE.style, "" );

export default function recognizeStyleInTag(
	tEditor: vsc.TextEditor, 
	pos: vsc.Position
): Recognized|null {
	const
		doc = tEditor.document,
		givenOffset = doc.offsetAt(pos),
		text = doc.getText();

	const startOffset = getTagStartOffset(text, givenOffset);
	if (-1 < startOffset) {
		tagRE.lastIndex = startOffset;
		const m = text.match(tagRE);
		if (m) {
			const endOffset = tagRE.lastIndex;
			if (startOffset < givenOffset && givenOffset < endOffset) {
				const 
					tagText = text.slice(startOffset, endOffset),
					m = tagText.match(styleRE);
				if (m?.index) {
					const pos = doc.positionAt(startOffset + m.index);
					return recognizeStyle(tEditor, pos);
				} else {}
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