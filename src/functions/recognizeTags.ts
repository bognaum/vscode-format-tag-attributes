import * as vsc from 'vscode';
import * as rawRE from "../regexp";
import Recognized from '../recognized.interface';
import recognizeTag from './recognizeTag';

export default function recognizeTags(
	tEditor: vsc.TextEditor, 
	range: vsc.Range
): Recognized[] {
	const 
		doc = tEditor.document,
		text = doc.getText(),
		startOffset = doc.offsetAt(range.start),
		endOffset = doc.offsetAt(range.end),
		tagRE = new RegExp(rawRE.tag, "y"),
		tags: Recognized[] = [];

	let i, next = startOffset;

	while (text[i = next++] && i < endOffset) {
		tagRE.lastIndex = i;
		const m = text.match(tagRE);
		if (m) {
			next = tagRE.lastIndex;
			const tag = recognizeTag(tEditor, doc.positionAt(i));
			if (tag) {
				tags.push(tag);
			} else {}
		} else {}
	}

	return tags;
}