import * as vsc from "vscode";

export default interface Recognized {
	isSplitted: boolean;
	range     : vsc.Range;
	split()   : string; 
	join()    : string; 
	toggle()  : string; 
}