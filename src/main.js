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
function getMethods(astBlock)
{
	if(astBlock.type === undefined)
	{
		for(var child in astBlock)
		{
			getMethods(astBlock[child]);
		}

		return;
	}

	if(astBlock.type === "BlockStatement" || astBlock.type === "FunctionDeclaration"
				|| astBlock.type === "Program")
	{
		if(astBlock.type === "FunctionDeclaration")
		{
			var foo = getID();
			methods[foo] = astBlock;
		}

		getMethods(astBlock.body);
	}
}

function checkMethod(method, sources)
{
	tainted = [];

	for(child in method.params)
	{
		console.log(method.params[child].name);
	}

	for(number in sources)
	{
		console.log(sources[number]);
		
		var foo = method.params[sources[number]];
		if(foo != undefined)
		{
			tainted.push(foo.name);
		}
	}

	console.log("\\\\\\");
	console.log(tainted);
	console.log("///");
}

var file_name 	= process.argv[2];
var file 	= fs.readFileSync( file_name, 'ascii' );
var ast		= esprima.parse( file, {loc: true, range: true, raw: true, token: true} );

getMethods(ast);

for(var child in methods)
{
	checkMethod(methods[child], [0, 1, 2]);
	console.log(methods[child]);
}

//console.log(ast);
