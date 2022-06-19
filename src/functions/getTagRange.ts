import * as vsc from 'vscode';

export default function getTagRange (doc: vsc.TextDocument, pos: vsc.Position): vsc.Range|null {
	const
		offset = doc.offsetAt(pos),
		text = doc.getText();
	let i = offset, v = "", a = 0, b = 0;
	while (v = text[i]) {
		if (v === "<") {
			a = i;
			break;
		}
		i --;
	}
	if (v && text[i + 1] !== "/") {
		i += 1;
		while (v = text[i]) {
			if (v === ">") {
				b = i + 1;
				break;
			}
			i ++;
		}
		if (v) {
			if (a <= offset && offset <= b) {
				// const substr = text.slice(a, b);
				// vsc.window.showInformationMessage(substr);
				return new vsc.Range(doc.positionAt(a), doc.positionAt(b));
			} else {
				// vsc.window.showWarningMessage("No opening tag");
			}
		} else {
			// vsc.window.showWarningMessage("No end");
		}
	} else {
		// vsc.window.showWarningMessage("No begin");
	}
	return null;
}