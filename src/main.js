var esprima     = require('esprima');
var fs      = require('fs');
var util    = require('util');
var analyzer  = new (require('./analyzer'))();

var file_name   = process.argv[ 2 ];
var ast     = parseFilename(file_name); 
var options = {

};
//analyzer.config( options );
analyzer.add( ast );

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
