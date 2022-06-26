import * as vsc from 'vscode';
import getTagMatch from './functions/getTagMatch';
import recognizeTag from './functions/recognizeTag';
import recognizeAttribs from './functions/recognizeAttribs';
import {
	getBaseIndent,
	// getTagStartOffset,
} from "./functions/base";

export {
	splitAttribs,
	joinAttribs,
	toggleAttribs,
	splitStyle,
	joinStyle,
	toggleStyle,
};

function splitAttribs(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {
		splitJoin(tEditor, edit, sel, "getMultiLineText"); 
	}
}

function joinAttribs(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {
		splitJoin(tEditor, edit, sel, "getOneLineText");
	}
}

function toggleAttribs(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	console.log(`args >>`, args);
	for (let sel of tEditor.selections) {
		if (sel.isEmpty) {
			const tag = recognizeTag(tEditor, sel.start);
			if (tag) {
				if (tag.isSplitted) {
					edit.replace(tag.range, tag.getOneLineText());
				} else {
					edit.replace(tag.range, tag.getMultiLineText());
				}
			} else {
				vsc.window.showWarningMessage("1 Opening or single tag was not recognized. You need to hover over the opening or single tag.");
			}
		} else {
			const attribs = recognizeAttribs(tEditor, sel);
			if (attribs) {
				if (attribs.isSplitted) {
					edit.replace(attribs.range, attribs.getOneLineText());
				} else {
					edit.replace(attribs.range, attribs.getMultiLineText());
				}
			} else {
				vsc.window.showWarningMessage("2 Opening or single tag was not recognized. You need to hover over the opening or single tag.");
			}
		}
	}
}

function splitStyle(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {}
}

function joinStyle(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	vsc.window.showQuickPick(["aaa", "bbb", "ccc"]).then((v) => {
		vsc.window.showInformationMessage(v || "fail");
	});
	for (let sel of tEditor.selections) {}
}

function toggleStyle(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	vsc.window.showInputBox().then((v) => {
		vsc.window.showInformationMessage(v || "fail");
	});
	for (let sel of tEditor.selections) {}
}

function splitJoin(
		tEditor: vsc.TextEditor, 
		edit: vsc.TextEditorEdit, 
		sel: vsc.Selection, 
		methodName: "getOneLineText"|"getMultiLineText"
) {
	if (sel.isEmpty) {
		const tag = recognizeTag(tEditor, sel.start);
		if (tag) {
			edit.replace(tag.range, tag[methodName]());
		} else {
			vsc.window.showWarningMessage("3 Opening or single tag was not recognized. You need to hover over the opening or single tag.");
		}
	} else {
		const attribs = recognizeAttribs(tEditor, sel);
		if (attribs) {
			edit.replace(attribs.range, attribs[methodName]());
		} else {
			vsc.window.showWarningMessage("4 Opening or single tag was not recognized. You need to hover over the opening or single tag.");
		}
	}
}