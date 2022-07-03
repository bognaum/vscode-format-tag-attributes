import * as vsc from 'vscode';
import recognizeTag from './functions/recognizeTag';
import recognizeAttribs from './functions/recognizeAttribs';
import recognizeStyle from './functions/recognizeStyle';
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
		changeAttribs(tEditor, edit, sel, "split"); 
	}
}

function joinAttribs(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {
		changeAttribs(tEditor, edit, sel, "join");
	}
}

function toggleAttribs(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {
		changeAttribs(tEditor, edit, sel, "toggle");
	}
}

function splitStyle(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {
		changeStyle(tEditor, edit, sel, "split");
	}
}

function joinStyle(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {
		changeStyle(tEditor, edit, sel, "join");
	}
}

function toggleStyle(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {
		changeStyle(tEditor, edit, sel, "toggle");
	}
}

function changeAttribs(
		tEditor: vsc.TextEditor, 
		edit: vsc.TextEditorEdit, 
		sel: vsc.Selection, 
		methodName: "split"|"join"|"toggle"
) {
	if (sel.isEmpty) {
		const tag = recognizeTag(tEditor, sel.start);
		if (tag) {
			edit.replace(tag.range, tag[methodName]());
		} else {
			vsc.window.showWarningMessage("Tag was not recognized. You need to hover over the opening or single tag.");
		}
	} else {
		const attribs = recognizeAttribs(tEditor, sel);
		if (attribs) {
			edit.replace(attribs.range, attribs[methodName]());
		} else {
			vsc.window.showWarningMessage("Attributes were not recognized. You need to select appropriate attributes.");
		}
	}
}

function changeStyle(
	tEditor: vsc.TextEditor, 
	edit: vsc.TextEditorEdit, 
	sel: vsc.Selection, 
	methodName: "split"|"join"|"toggle"
) {
	if (sel.isEmpty) {
		const style = recognizeStyle(tEditor, sel.start);
		if (style) {
			edit.replace(style.range, style[methodName]());
		} else {
			const tag = recognizeTag(tEditor, sel.start);
			if (tag?.stileStartPos) {
				const style = recognizeStyle(tEditor, tag.stileStartPos);
				if (style) {
					edit.replace(style.range, style[methodName]());
				} else {
					vsc.window.showErrorMessage("Error. Stile wos not recognized.")
				}
			} else {
				vsc.window.showWarningMessage("A style attribute was not recognized. You need to hover over the style attribute.");
			}
		}
	} else {}
}