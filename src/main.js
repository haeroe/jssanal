var esprima 	= require('esprima');
var fs		= require('fs');
var util	= require('util');

var methods	= {};
var variables	= {};
var sources	= [];

function newMethod(name)
{
	tempMethod = new Object();

	tempMethod.name = name;

	tempMethod.isSink = false;
	tempMethod.isSource = false;
	tempMethod.isCleaner = false;

	tempMethod.params = {};
	tempMethod.calls = {};
	tempMethod.aliases = {};

	tempMethod.addCall = function (callee, isDangerous)
				{
					tempMethod.calls[callee] = isDangerous;
				}

	return tempMethod;
}

function parseAST(astBlock)
{
	if(astBlock.type === undefined)
		return;

	console.log(astBlock.type);

	switch(astBlock.type)
	{
		case "CallExpression":
			var method = newMethod(astBlock.callee.name);
			methods[method] = method.isSource;
			break;


		case "NewExpression":
			
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
			parseAST(astBlock.init);
			break;			


		default:
			console.log("Type not found! - " + astBlock.type);
			process.exit(1);
	}

}

function isSource(name)
{
	for(source in sources)
		if(sources[source] === name)
			return true;

	return false;
}

function isTainted(name, contextMethod)
{
	return false;
}


var file_name 	= process.argv[2];
var file 	= fs.readFileSync( file_name, 'ascii' );
var ast		= esprima.parse( file, {loc: true, range: true, raw: true, token: true} );

parseAST(ast);
