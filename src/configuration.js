// for setting your own whitelisted functions that you want to ignore.
var whiteList = [""];

// for setting your own blacklisted functions that you want to include in addition to the frameWork defaults.
var blackList = [""];

var functionSinks = ["eval", "Function", "setTimeout", "setInterval", "execScript"];

var memberAssignmentSinks = {
        "innerHTML" : null,
        "src" :	null,
        "text" : null,
        "textContent" : null,
        "innerText" : null,
        "value"	: null,

        "hostname" : ["location"],
        "protocol" : ["location"],
        "pathname" : ["location"],
        "href" : ["location"],
        "location" : ["window",	"document"]  
}

var memberFunctionSinks	= {
        "generateCRMFRequest" : ["crypto"],
        "write" : ["document"],
        "writeln" : ["document"],
        "createContextualFragment" : ["Range"],
        "search" : ["location"],
        "assign" : ["location"],
        "replace" : ["location"],
}

module.exports = {
	functionSinks: functionSinks,
	memberFunctionSinks: memberFunctionSinks,
	memberAssignmentSinks: memberAssignmentSinks
}
