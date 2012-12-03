// for setting your own whitelisted functions that you want to ignore.
var whiteList = ["escape", "htmlEscape", "esc"];

// for setting your own blacklisted functions that you want to include in addition to the frameWork defaults.
var blackList = [""];

var functionSinks = ["eval", "Function", "setTimeout", "setInterval", "execScript"];

var memberFunctionSinks	= {
    "generateCRMFRequest" : ["crypto"],
    "write"        : ["document"],
    "writeln"      : ["document"],
    "createContextualFragment" : ["Range"],
    "search"       : ["location"],
    "assign"       : ["location"],
    "replace"      : ["location"],
    
    "html"         : null, // jQuery MemberExpression 
    "append"       : null, // jQuery MemberExpression  
    "parseHTML"    : null, // jQuery MemberExpression
    "globalEval"   : null  // jQuery MemberExpression
};

var assignmentSinks = [];

var memberAssignmentSinks = {
    "innerHTML"    : null,
    "src"          : null,
    "text"         : null,
    "textContent"  : null,
    "innerText"    : null,
    "value"        : null,

    "hostname"     : ["location"],
    "protocol"     : ["location"],
    "pathname"     : ["location"],
    "href"         : ["location"],
    "location"     : ["window", "document"]  
};

var memberEventSinks = {
    "onblur"       : null,
    "onchange"     : null,
    "onclick"      : null,
    "onfocus"      : null,
    "onload"       : null,
    "onreset"      : null,
    "onsubmit"     : null,
    "onunload"     : null
};

var varSources = ["location"];

var memberVarSources = {
	"referrer"     : ["document"],
	"URL"          : ["document"],
	"documentURI"  : ["document"],
	"URLUnencoded" : ["document"],
	"baseURI"      : ["document"],
	"cookie"       : ["document"],
	"href"         : ["location"],
	"search"       : ["location"],
	"hash"         : ["location"],
	"pathname"     : ["location"],
	"name"         : ["window"]
};

var memberFunctionSources = {
	"pushState"    : ["history"],
	"replaceState" : ["history"]
};

module.exports = {
	functionSinks: functionSinks,
	assignmentSinks: assignmentSinks,
	memberFunctionSinks: memberFunctionSinks,
	memberAssignmentSinks: memberAssignmentSinks,
    memberEventSinks: memberEventSinks,
	varSources: varSources,
	memberVarSources: memberVarSources,
	memberFunctionSources: memberFunctionSources
};
