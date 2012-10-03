var esprima 	= require('esprima');
var fs		= require('fs');
var util	= require('util');

var methods	= {};
var variables	= {};

var currMethod;
var currVar;


function newMethod(name)
{
	tempMethod = new Object();

	tempMethod.name = name;

	tempMethod.isSink = false;
	tempMethod.isSource = false;

	tempMethod.params = {};
	tempMethod.calls = {};

	tempMethod.addParam = function (paramName, isTainted)
				{
					params.paramName = isTainted;
				}

	tempMethod.addCall = function (callee, isDangerous)
				{
					calls.callee = isDangerous;
				}

	return tempMethod;
}

function parseAST(astBlock)
{
	if(astBlock.type === undefined)
		return;

	var localMethod = currMethod;
	var localVar = currVar;

	switch(astBlock.type)
	{
		case "CallExpression":
			var method = newMethod(astBlock.callee.name);
			
			break;


		case "Program":
			for(var child in astBlock.body)
			{
				parseAST(astBlock.body[child]);
			}
			break;


		case "VariableDeclaration":
			for(var child in astBlock.declarations)
			{
				parseAST(astBlock.declarations[child]);
			}
			break;


		case "VariableDeclarator":
			//TODO: Make astBlock.id.name globally unique and store it
			parseAST(astBlock.init);
			break;			


		default:
			console.log("Type not found! - " + astBlock.type);
			process.exit(1);
	}

	currMethod = localMethod;
	currVar = localVar;
}


var file_name 	= process.argv[2];
var file 	= fs.readFileSync( file_name, 'ascii' );
var ast		= esprima.parse( file, {loc: true, range: true, raw: true, token: true} );

parseAST(ast);
