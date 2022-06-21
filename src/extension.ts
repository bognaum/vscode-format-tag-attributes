import * as vsc from 'vscode';

import {
	splitAttribs,
	joinAttribs,
	toggleAttribs,
	splitStyle,
	joinStyle,
	toggleStyle,
} from "./commands";

export function activate(context: vsc.ExtensionContext) {
	const commands = [
		vsc.commands.registerTextEditorCommand ("formatTagAttribs.splitAttribs" , splitAttribs ),
		vsc.commands.registerTextEditorCommand ("formatTagAttribs.joinAttribs"  , joinAttribs  ),
		vsc.commands.registerTextEditorCommand ("formatTagAttribs.toggleAttribs", toggleAttribs),
		vsc.commands.registerTextEditorCommand ("formatTagAttribs.splitStyle"   , splitStyle   ),
		vsc.commands.registerTextEditorCommand ("formatTagAttribs.joinStyle"    , joinStyle    ),
		vsc.commands.registerTextEditorCommand ("formatTagAttribs.toggleStyle"  , toggleStyle  ),
	];

	context.subscriptions.push(...commands);
}

// this method is called when your extension is deactivated
export function deactivate() {}
