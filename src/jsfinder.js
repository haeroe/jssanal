var userInput = '/';
var jsArray = [];
var jsArrayCount = 0;
var fs = require('fs');

/* 
 * Walking through the folder recursively and saving the files found to a list.
 * @param { string } userInput contains the foldername given by the user.
 * @return { Array.string } a list of .js files found with their paths.
 */
function readFolder(userInput) {
	var files = require('findit').sync(__dirname + '/');
	if (userInput) { 
		if(fs.exists(__dirname + '/' + userInput)) {
			files = require('findit').sync(__dirname + '/' + userInput);
		} 
		else {
			files = require('findit').sync(userInput);
		}
	}

	/*
	*  A function for checking if string str ends with the suffix string.
	*  @param { string } str the string that you want to inspect eg. 'filename.js'.
	*  @param { string } suffix is the part you want to find eg. '.js'.
	*/
	function endsWith(str, suffix) {
		"use strict";
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}

	/* 
	 * Iterating through the files to find all the .js files and adding those to an array.
	 * Here we are assuming that the path is relative to the current folder.
	 */
	for (var i=0; i<files.length; i++) {
		if(endsWith(files[i],'.js')) {
			jsArray[jsArrayCount] = files[i];
			jsArrayCount++;
		}
	}
 return jsArray;
}

module.exports = { find: readFolder }
