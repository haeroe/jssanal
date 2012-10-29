// legend: * == parameter(needs to be checked),

// for setting your own whitelisted functions that you want to ignore.
var whiteList = [""];

// for setting your own blacklisted functions that you want to include in addition to the frameWork defaults.
var blackList = [""];

// the known sinks in jQuery.
var jQuerySinks = ["$ELEMENT.append(*)","$ELEMENT.html(*)", "jQuery.globalEval(*)"];

// DOM XSS sinks.
var domSinks = ["document.write(*)", "document.writeln(*)", "element.innerHTML = *", "element.outerHTML = *", "window.location =", "location.assign(*)", "location.replace(*), "range.createContextualFragment(*)", "HTMLBUTTON.value = *" ];

// Browser JS execution sinks.
var browserSinks = ["eval(*)", "Function()", "setTimeout(*)", "setInterval(*)", "execScript(*)", "crypto.generateCRMFRequest()", "ScriptElement.src = *", "ScriptElement.text = *", "ScriptElement.textContent = *", "ScriptElement.innerText = *", "anyTag.onclick = *"];


