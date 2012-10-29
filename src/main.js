var esprima 	= require('esprima');
var fs		= require('fs');
var util	= require('util');

var id = 0;
var methods = {};

// Function to assign a global ID for JSON blocks in the parse tree
function getID()
{
	id++;
	return id;
}

//recursive parsing function for parse tree blocks
function parseAST(astBlock)
{
	console.log(astBlock.type);

	if(astBlock.type === undefined)
	{
		for(var child in astBlock)
		{
			parseAST(astBlock[child]);
		}

		return;
	}

	if(astBlock.type === "BlockStatement" || astBlock.type === "FunctionDeclaration"
				|| astBlock.type === "FunctionExpression" || astBlock.type === "Program")
	{
		if(astBlock.type === "FunctionDeclaration" || astBlock.type === "FunctionExpression")
		{
			var foo = getID();
			methods[foo] = astBlock;
		}

		parseAST(astBlock.body);
	}
}

var file_name 	= process.argv[2];
var file 	= fs.readFileSync( file_name, 'ascii' );
var ast		= esprima.parse( file, {loc: true, range: true, raw: true, token: true} );

parseAST(ast);

