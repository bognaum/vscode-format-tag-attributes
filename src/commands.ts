import * as vsc from 'vscode';
import getTagMatch from './functions/getTagMatch';
import recognizeTag from './functions/recognizeTag';
import recognizeAttribs from './functions/recognizeAttribs';

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
		const 
			doc  = tEditor.document,
			opts = tEditor.options,
			EOL  = [0, "\n", "\r\n"][doc.eol],
			IND  = opts.insertSpaces && typeof opts.tabSize === "number" ? 
				" ".repeat(opts.tabSize) : "\t",
			m = getTagMatch(doc, sel.start);
		if (m) {
			// vsc.window.showInformationMessage(m.tagStr);
			let newCode = m["<"] + m.tagName + EOL;
			for (const attr of m.attribArr) {
				newCode += m.baseIndent + IND + attr + EOL;
			}
			newCode += m.baseIndent + m[">"];

			edit.replace(m.range, newCode);
		} else {
			vsc.window.showWarningMessage("You need to hover over the opening tag.");
		}
	}
}

function joinAttribs(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {
		const 
				doc  = tEditor.document,
				opts = tEditor.options,
				EOL  = [0, "\n", "\r\n"][doc.eol],
				IND  = opts.insertSpaces && typeof opts.tabSize === "number" ? 
					" ".repeat(opts.tabSize) : "\t",
				m = getTagMatch(doc, sel.start);
			if (m) {
				// vsc.window.showInformationMessage(m.tagStr);
				const 
					attribStr = m.attribArr.map(v => v.trim()).join(" "),
					newCode = m["<"] + m.tagName + " " + attribStr + m[">"];

				edit.replace(m.range, newCode);
			} else {
				vsc.window.showWarningMessage("You need to hover over the opening tag.");
			}
	}
}

function toggleAttribs(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {
		const 
			doc  = tEditor.document,
			opts = tEditor.options,
			m = getTagMatch(doc, sel.start);
			if (m) {
				if (m.splitted) {
					vsc.commands.executeCommand("formatTagAttribs.joinAttribs");
				} else {
					vsc.commands.executeCommand("formatTagAttribs.splitAttribs");
				}
			} else {
				vsc.window.showWarningMessage("You need to hover over the opening tag.");
			} 
	}
}

function splitStyle(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {}
}

function joinStyle(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {}
}

function toggleStyle(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	for (let sel of tEditor.selections) {}
}