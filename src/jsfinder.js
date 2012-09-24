var fs = require('fs');
//var files = fs.readdirSync(__dirname + '/../examples/');
var files = require('findit').sync(__dirname);
console.dir(files);

var jsArray = new Array();
var jsArrayCount = 0;

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/*
for (var i=0; i<files.length; i++) {
	if(endsWith(files[i],'.js')) {
		jsArray[jsArrayCount] = __dirname + files[i];
		//console.log('file: ' + files[i] + '\n');
		jsArrayCount++;
	}
}
*/

//console.log(jsArray);
