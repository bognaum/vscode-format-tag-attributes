import * as vsc from "vscode";

export default interface Recognized {
	isSplitted: boolean;
	range     : vsc.Range;
	stileStartPos?: vsc.Position|null;
	split()   : string; 
	join()    : string; 
	toggle()  : string; 
}