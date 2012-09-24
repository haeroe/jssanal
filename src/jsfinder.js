var userInput = '/';
var jsArray = new Array();
var jsArrayCount = 0;

if(process.argv.length < 3) {
	console.log(process.argv.length);
	console.log('No input parameter given. Beginning search from current folder. \n');
} else {
	userInput = process.argv[2];
}

var files = require('findit').sync(__dirname + userInput);


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
