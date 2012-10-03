var userInput = '/';
var jsArray = [];
var jsArrayCount = 0;

// Checking if the user gave a target folder as a parameter.
if(process.argv.length < 3) {
	console.log('No input parameter given. Beginning search from current folder. \n');
} else {
	userInput = process.argv[2];
}

// Walking through the folder recursively and saving the files found to a list.
var files = require('findit').sync(__dirname + userInput);

// A function for checking if string str ends with the suffix string.
function endsWith(str, suffix) {
	"use strict";
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

// Iterating through the files to find all the .js files and adding those to an array.
// Here we are assuming that the path is relative to the current folder.
for (var i=0; i<files.length; i++) {
	if(endsWith(files[i],'.js')) {
		jsArray[jsArrayCount] = __dirname + files[i];
		jsArrayCount++;
	}
}

// Printing out the array for debugging purposes.
console.log(jsArray);

return jsArray;