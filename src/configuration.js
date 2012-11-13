// for setting your own whitelisted functions that you want to ignore.
var whiteList = [""];

// for setting your own blacklisted functions that you want to include in addition to the frameWork defaults.
var blackList = [""];

var functionSinks = ["eval", "Function", "setTimeout", "setInterval", "execScript"];

var assignmentSinks = ["ScriptElement.src", "ScriptElement.text", "ScriptElement.textContent", "ScriptElement.innerText", "anyTag.onclick","element.innerHTML", "element.outerHTML", "window.location", "HTMLBUTTON.value"];

// when callexpression callee contains memberexpression with object and a property the property.name is one of these
var memberFunctionSinks = ["write", "writeln", "assign", "replace", "createContextualFragment", "globalEval", "append", "html", "generateCRMFRequest", "innerHTML"];

module.exports = {
	functionSinks: functionSinks,
	memberFunctionSinks: memberFunctionSinks,
	assignmentSinks: assignmentSinks
}
