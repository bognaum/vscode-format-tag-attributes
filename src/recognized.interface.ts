import * as vsc from "vscode";

export default interface Recognized {
	isSplitted: boolean;
	range: vsc.Range;
	getOneLineText(): string; 
	getMultiLineText(): string; 
}