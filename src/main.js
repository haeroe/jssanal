var esprima = require('esprima'),
	fs = require('fs'),
	util = require('util');

var file_name = process.argv[2];
var file = fs.readFileSync( file_name, 'ascii' );

var syntax_tree = esprima.parse( file, {loc: true, range: true, raw: true, token: true} );

console.log(util.inspect( syntax_tree.body, false, null));

