/* export const
	// tag = /(<\s*([a-zA-z0-9_\:\-]+))\s*((?:(?:[a-zA-z0-9_\:\-]+\s*(?:=\s*"[^"]*")?)\s*)*)(\/?>)/y,
	tag = /(<\s*([a-zA-z0-9_\:\-]+))\s*((?:(?:[a-zA-z0-9_\:\-]+\s*(?:=\s*('|")[^\4]*\4)?)\s*)*)(\/?>)/y,
	attribs = /([a-zA-z0-9_\:\-]+)\s*(?:=\s*('|")([^"]*)\2)?/g,
	attrib  = /([a-zA-z0-9_\:\-]+)\s*(?:=\s*('|")([^"]*)\2)?/; */

export const 
	name   = String.raw`[a-zA-z0-9_\:\-]+`,
	quoted = String.raw`(?<attV>'[^']*'|"[^"]*")`,
	attr   = String.raw`(?<attName>${name})\s*(?:=\s*${quoted}\s*)?`,
	tag    = String.raw`((?<A><)\s*(?<tagName>${name}))\s*(?<attribs>(?:${attr})*)(?<B>\/?>)`;