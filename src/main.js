var esprima  = require('esprima');
var fs       = require('fs');
var util     = require('util');
var analyzer = new (require('./analyzer'))();

//var esprima_options = {loc: true, range: true, raw: true, token: true};
var options = {loc: false, range: false, raw: false, token: true} 

var file_name = process.argv[2];
var file      = fs.readFileSync( file_name, 'ascii' );
var ast       = esprima.parse( file, options );

var options = {

}
analyzer.config( options );

analyzer.add( ast );

function log_f( arg ){
    console.log(arg);
}

analyzer.process();
analyzer.report( log_f );


