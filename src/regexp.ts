const 
	name   = String.raw`[a-zA-z0-9_\:\-]+`,
	quoted = String.raw`(?<attV>'[^']*'|"[^"]*")`;

export const 
	style  = String.raw`(?<a>style\s*=\s*)(&<quoted>${quoted})`,
	attr   = String.raw`(?<attName>${name})(?:\s*=\s*${quoted})?`,
	tag    = String.raw`((?<A><)\s*(?<tagName>${name}))(?<attribs>(?:\s*${attr}\s*)*)(?<B>\/?>)`;