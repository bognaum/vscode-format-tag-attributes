import * as vsc from 'vscode';
import getTagRange from './functions/getTagRange';

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
			range = getTagRange(doc, sel.start);
		if (range) {
			const substr = tEditor.document.getText(range);
			vsc.window.showInformationMessage(substr);
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