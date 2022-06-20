const 
	name   = String.raw`[a-zA-z0-9_\:\-]+`,
	quoted = String.raw`(?<attV>'[^']*'|"[^"]*")`;

export const 
	attr   = String.raw`(?<attName>${name})\s*(?:=\s*${quoted}\s*)?`,
	tag    = String.raw`((?<A><)\s*(?<tagName>${name}))(?<C>\s*)(?<attribs>(?:${attr})*)(?<B>\/?>)`;