import * as vsc from "vscode";

export default interface Recognized {
	isSplitted: boolean;
	range     : vsc.Range;
	style?    : Recognized|null;
	split()   : string; 
	join()    : string; 
	toggle()  : string; 
}