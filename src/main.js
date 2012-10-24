var esprima 	= require('esprima');
var fs		= require('fs');
var util	= require('util');

var id = 0;
var blocks = {};

// Function to assign a global ID for JSON blocks in the parse tree
function getID()
{
	id++;
	return id;
}

//recursive parsing function for parse tree blocks
function parseAST(astBlock)
{
	if(astBlock.type === undefined)
		return;

	astBlock.ID = getID();
	blocks[astBlock.ID] = astBlock;

	console.log(astBlock.type);

	for(var child in astBlock)
	{
		console.log(child.type);

		if(child.type === "AssignmentExpression")
		{
			
		}

		parseAST(child);
	}
}

var file_name 	= process.argv[2];
var file 	= fs.readFileSync( file_name, 'ascii' );
var ast		= esprima.parse( file, {loc: true, range: true, raw: true, token: true} );

parseAST(ast);
