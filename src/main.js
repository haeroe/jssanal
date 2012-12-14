var esprima   = require('./npm/esprima/1.0.2/package/esprima');
var fs        = require('fs');
var util      = require('./npm/formidable/1.0.11/package/lib/util');
var url       = require('url');
var analyzer  = new (require('./analyzer'))();
var jsfinder  = require('./jsfinder');
var urlfinder = require('./urlFinder');


var DOWNLOAD_DIR = './url_downloads/';
var currUrl;
var remaining = 0;

var options = {

};
analyzer.config( options );

function log_f( arg ){
    console.log(arg);
}

// parse command line arguments
if (process.argv[2] !== undefined) {

	for (var i = 2; i < process.argv.length; i++) {
        // file path
		if(process.argv[ i ] === '-f')
		{
			var path  = process.argv[ i+1 ];
			var files = jsfinder.find(path);
			for (var i = 0; i < files.length; i++) {
				var ast = parseFilename(files[ i ]);
				analyzer.add( ast );
			}
			
			i++;
		} // urls
        else if(process.argv[i] === '-u')
		{
			if(remaining < 0) {
				remaining = 0;
			}
			
			remaining++;
			currUrl     = process.argv[i+1];
			var urlFile = new urlfinder(process.argv[i+1]);
			urlFile.wget(parseUrlDataCb);
			
			i++;		
		} else
		{
			var file_name = process.argv[ i ];
			var ast       = parseFilename(file_name);
			analyzer.add( ast );
		}
	}
}

if(remaining === 0) {
	analyzer.process();
	analyzer.report( log_f );
}

function parseFilename(file_name) {
	var file = fs.readFileSync( file_name, 'ascii' );
	var ast  = astRecurse(file, file_name);
	return ast;
}

// callback
function parseUrlDataCb(result) {
    var filepath = storeToFile(result); // store results to file
  
    var ast = astRecurse(result, "url#" + filepath);
    analyzer.add(ast);
    
    if(remaining === 1) {
        analyzer.process();
        analyzer.report( log_f );
    } else {
        remaining--;
    }
}

function storeToFile(result) {
    var ret = 'all.js';
    try {
        if ( fs.existsSync(DOWNLOAD_DIR) === false ) {
            fs.mkdirSync(DOWNLOAD_DIR, 0750);
        }
        var filename = url.parse(currUrl).pathname.split('/').pop();
        filename = ((filename === '*.js') ? 'all.js' : filename);
        var filepath = DOWNLOAD_DIR + filename;
        fs.writeFileSync(filepath, result);
        return filepath;
    } catch(e) {
        console.log('Failed to create directory ' + DOWNLOAD_DIR + ': ' + e);    
    }    
    return ret;
}    

function astRecurse(rawdata, filename) {
	var ast = esprima.parse( rawdata, {loc: true, range: true, raw: true, token: true} );
    
	function rec( astBlock ) {
		if (astBlock === null || astBlock === undefined || astBlock.returnDependencies) {
			return;
		}
		if (astBlock.loc !== undefined ) {
			astBlock.loc.file = filename;
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
