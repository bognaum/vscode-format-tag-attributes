import * as vsc from 'vscode';

import {
	wrapAttribs,
	unwrapAttribs,
	toggleAttribs,
	wrapStyle,
	unwrapStyle,
	toggleStyle,
} from "./commands";

export function activate(context: vsc.ExtensionContext) {
	
	console.log('Congratulations, your extension "wrap-tag-attributes" is now active!');
	const commands = [
		vsc.commands.registerTextEditorCommand ("wrapTagAttribs.wrapAttribs"  , wrapAttribs  ),
		vsc.commands.registerTextEditorCommand ("wrapTagAttribs.unwrapAttribs", unwrapAttribs),
		vsc.commands.registerTextEditorCommand ("wrapTagAttribs.toggleAttribs", toggleAttribs),
		vsc.commands.registerTextEditorCommand ("wrapTagAttribs.wrapStyle"    , wrapStyle    ),
		vsc.commands.registerTextEditorCommand ("wrapTagAttribs.unwrapStyle"  , unwrapStyle  ),
		vsc.commands.registerTextEditorCommand ("wrapTagAttribs.toggleStyle"  , toggleStyle  ),
	];

	context.subscriptions.push(...commands);
}

// this method is called when your extension is deactivated
export function deactivate() {}
