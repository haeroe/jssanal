var userInput = '/';
var jsArray = new Array();
var jsArrayCount = 0;

// Checking if the user gave a target folder as a parameter.
if(process.argv.length < 3) {
	console.log(process.argv.length);
	console.log('No input parameter given. Beginning search from current folder. \n');
} else {
	userInput = process.argv[2];
}

// Walking through the folder recursively and saving the files found to a list.
var files = require('findit').sync(__dirname + userInput);

// A function for checking if parameter str ends with the suffix parameter.
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

// Iterating through the files to find all the .js files and adding those to an array.
for (var i=0; i<files.length; i++) {
	if(endsWith(files[i],'.js')) {
		jsArray[jsArrayCount] = __dirname + files[i];
		jsArrayCount++;
	}
}

// Printing out the array for debugging purposes.
console.log(jsArray);
