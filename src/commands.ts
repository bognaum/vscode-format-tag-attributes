import * as vsc from 'vscode';
import getTagMatch from './functions/getTagMatch';

export {
	wrapAttribs,
	unwrapAttribs,
	toggleAttribs,
	wrapStyle,
	unwrapStyle,
	toggleStyle,
};

function wrapAttribs(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {
		const 
			doc = tEditor.document,
			m = getTagMatch(doc, sel.start);
		if (m) {
			// vsc.window.showInformationMessage(m.tagStr);
			vsc.window.showInformationMessage(m.attribCount.toString());
			for (const attr of m.attribs) {
				vsc.window.showInformationMessage(attr);
			}
		} else {
			vsc.window.showWarningMessage("You need to hover over the opening tag.");
		}
	}
}

function unwrapAttribs(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {}
}

function toggleAttribs(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {}
}

function wrapStyle(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {}
}

function unwrapStyle(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {}
}

function toggleStyle(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {}
}