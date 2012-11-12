// for setting your own whitelisted functions that you want to ignore.
var whiteList = [""];

// for setting your own blacklisted functions that you want to include in addition to the frameWork defaults.
var blackList = [""];

var functionSinks = ["eval", "Function", "setTimeout", "setInterval", "execScript", "crypto.generateCRMFRequest", "$ELEMENT.append","$ELEMENT.html", "jQuery.globalEval", "document.write", "document.writeln", "location.assign", "location.replace", "range.createContextualFragment"];

var assignmentSinks = ["ScriptElement.src", "ScriptElement.text", "ScriptElement.textContent", "ScriptElement.innerText", "anyTag.onclick","element.innerHTML", "element.outerHTML", "window.location", "HTMLBUTTON.value"];

module.exports = {
	functionSinks: functionSinks
}
