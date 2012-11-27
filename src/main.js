var esprima     = require('esprima');
var fs      	= require('fs');
var util    	= require('util');
var analyzer  	= new (require('./analyzer'))();
var jsfinder	= require('./jsfinder');
var urlfinder 	= require('./urlFinder');

var currUrl;

if (process.argv[2] !== undefined) {

	for (var i = 2; i < process.argv.length; i++) {
		if(process.argv[ i ] === '-f')
		{
			var path = process.argv[ i+1 ];
			var files = jsfinder.find(path);
			for (var i = 0; i < files.length; i++) {
				var ast = parseFilename(files[ i ]);
				analyzer.add( ast );
			}
			
			i++;
		} else if(process.argv[i] === '-u')
		{
			currUrl = process.argv[i+1];
			var urlFile = new urlfinder(process.argv[i+1]);
			urlFile.wget(parseUrlData);
			
			i++;		
		} else
		{
			var file_name   = process.argv[ i ];
			var ast     = parseFilename(file_name);
			analyzer.add( ast );
		}
	}
}

/*

if (process.argv[2] !== undefined && process.argv[2] === '-f') {
  var path = process.argv[3];
	var files = jsfinder.find(path);
	for (var i = 0; i < files.length; i++) {
		var ast = parseFilename(files[i]);
		analyzer.add( ast );
	}
}
else { // if the file wasn't a relative path
	for (var i = 2; i < process.argv.length; i++) {
		var file_name   = process.argv[ i ];
		var ast     = parseFilename(file_name);
		analyzer.add( ast );
	} 


*/

var options = {

};
//analyzer.config( options );

function log_f( arg ){
    console.log(arg);
}

analyzer.process();
analyzer.report( log_f );

function parseFilename(file_name) {
	var file    = fs.readFileSync( file_name, 'ascii' );
	var ast = esprima.parse( file, {loc: true, range: true, raw: true, token: true} );
	
	function rec( astBlock ) {
		if (astBlock === null || astBlock === undefined || astBlock.returnDependencies) {
			return;
		}
		if (astBlock.loc !== undefined ) {
			astBlock.loc.file = file_name;
		}
		var blockType = Object.prototype.toString.call(astBlock).slice(8, -1);
		if(blockType === "Object" || blockType === "Array") {
			for(var child in astBlock) {
				rec( astBlock[ child ] );
			}
		}
    }	
	rec( ast );
	return ast;
}

function parseUrlData(content) {
	var ast = esprima.parse( content, {loc: true, range: true, raw: true, token: true} );
	
	function rec( astBlock ) {
		if (astBlock === null || astBlock === undefined || astBlock.returnDependencies) {
			return;
		}
		if (astBlock.loc !== undefined ) {
			astBlock.loc.file = currUrl;
		}
		var blockType = Object.prototype.toString.call(astBlock).slice(8, -1);
		if(blockType === "Object" || blockType === "Array") {
			for(var child in astBlock) {
				rec( astBlock[ child ] );
			}
		}
    }	
	rec( ast );
	analyzer.add( ast );
}
