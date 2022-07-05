import * as vsc from 'vscode';
import Recognized from './recognized.interface';
import recognizeTag from './functions/recognizeTag';
import recognizeTags from './functions/recognizeTags';
import recognizeStyle from './functions/recognizeStyle';
import recognizeStyles from './functions/recognizeStyles';

export {
	splitAttribs,
	joinAttribs,
	toggleAttribs,
	splitStyle,
	joinStyle,
	toggleStyle,
};

interface RecognizeCallbacks {
	emptySel: (a: vsc.TextEditor, b: vsc.Position) =>  Recognized|null;
	fullSel:  (a: vsc.TextEditor, b: vsc.Range)    => (Recognized|null)[];
}

const 
	toAttrs: RecognizeCallbacks = {
		emptySel: recognizeTag,
		fullSel : recognizeTags,
	},
	toStyle: RecognizeCallbacks = {
		emptySel: recognizeStyle,
		fullSel : recognizeStyles
	},
	make = {
		get split () {return true ;},
		get join  () {return false;},
		get toggle() {return null ;},
	};

function splitAttribs(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	change(toAttrs, {status: make["split"]}, tEditor, edit);
}

function joinAttribs(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	change(toAttrs, {status: make["join"]}, tEditor, edit);
}

function toggleAttribs(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	change(toAttrs, {status: make["toggle"]}, tEditor, edit);
}

function splitStyle(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	change(toStyle, {status: make["split"]}, tEditor, edit);
}

function joinStyle(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	change(toStyle, {status: make["join"]}, tEditor, edit);
}

function toggleStyle(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, args: any[]) {
	change(toStyle, {status: make["toggle"]}, tEditor, edit);
}


function change(
	cbs: RecognizeCallbacks,
	opts      : {status: null|boolean},
	tEditor   : vsc.TextEditor,
	edit      : vsc.TextEditorEdit
): void {
	const subjects = recognizeThe(cbs, tEditor);
	for (const subj of subjects) {
		opts.status = opts.status ?? subj.isSplitted;
		const newText = opts.status ? subj.join() : subj.split();
		edit.replace(subj.range, newText);
	}
}

function recognizeThe(
	cbs: RecognizeCallbacks,
	tEditor   : vsc.TextEditor
): Recognized[] {
	return tEditor.selections.map(sel => {
		if (sel.isEmpty) {
			return cbs.emptySel(tEditor, sel.active);
		} else {
			return cbs.fullSel(tEditor, sel);
		}
	}).flat().filter(fn);

	function fn(v: Recognized|null): v is Recognized {
		return !!v;
	}
}
