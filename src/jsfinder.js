var fs = require('fs');
var files = fs.readdirSync(__dirname + '/../examples/');
var jsArray = new Array();
var jsArrayCount = 0;

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function findJSFiles(folder) {
	files = fs.readdirSync(__dirname + folder);
	for (var i=0; i<files.length; i++) {
		if(endsWith(files[i],'.js')) {
			jsArray[jsArrayCount] = __dirname + files[i];
			//console.log('file: ' + files[i] + '\n');
			jsArrayCount++;
		}
	}
	return jsArray;
}

console.log(jsArray);
