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

	for(number in sources)
	{
		var foo = method.params[sources[number]];
		if(foo != undefined)
		{
			tainted.push(foo.name);
		}
	}

	if(method.body.type === undefined)
	{
		return;
	}

	if(method.body.type === "BlockStatement")
	{
		var block = method.body.body;
		for(child in block)
		{
//			console.log(block[child].type);

			switch(block[child].type)
			{
				case "ExpressionStatement":
					checkLine(block[child].expression, tainted);
					break;				
				default:
					//checkLine(block[child], tainted);
					break;
			}
		}		

		return;
	}

	checkLine(method.body);
}

function checkLine(expr, tainted)
{
	switch(expr.type)
	{
		case "AssignmentExpression":
			if(isSource(expr.right))
			{
				console.log("Source found!");
				//console.log(expr.left);
				tainted.push(expr.left.name);
			}
			break;
		case "ExpressionStatement":
		case "VariableDeclaration":
			break;
		default:
			console.log("Unknown type! " + expr.type);
			break;
	}

//	console.log(expr);
//	console.log("ADASDASD");
}

function isSource(expr)
{
//	console.log(expr);

	switch(expr.type)
	{
		case "MemberExpression":
			if(expr.object.name === "document")
			{
				if(expr.property.name === "referrer")
				{
					return true;
				}
			}
			break;
		default:
			break;
	}

	return false;
}

var file_name 	= process.argv[2];
var file 	= fs.readFileSync( file_name, 'ascii' );
var ast		= esprima.parse( file, {loc: true, range: true, raw: true, token: true} );

getMethods(ast);

for(var child in methods)
{
	checkMethod(methods[child], [0, 1, 2]);
//	console.log(methods[child]);
}

//console.log(ast);
