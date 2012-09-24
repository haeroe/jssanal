var fs = require('fs');
var files = require('findit').sync(__dirname);


var jsArray = new Array();
var jsArrayCount = 0;

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

for (var i=0; i<files.length; i++) {
	if(endsWith(files[i],'.js')) {
		jsArray[jsArrayCount] = __dirname + files[i];
		jsArrayCount++;
	}
}

console.log(jsArray);
