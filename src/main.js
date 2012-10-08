var esprima 	= require('esprima');
var fs		= require('fs');
var util	= require('util');

var methods	= {};
var variables	= {};
var sources	= [];

var globalContext;

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

	tempMethod.addParam = function (paramName, isTainted)
				{
					tempMethod.params.paramName = isTainted;
				}

	tempMethod.addCall = function (callee, isDangerous)
				{
					tempMethod.calls.callee = isDangerous;
				}

	return tempMethod;
}

function parseAST(astBlock)
{
	if(astBlock.type === undefined)
		return;

	var methodContext = globalContext;

	console.log(astBlock.type);

	switch(astBlock.type)
	{
		case "CallExpression":
			var method = newMethod(astBlock.callee.name);
			for(var arg in astBlock.arguments)
				method.addParam(arg, isTainted(arg, method.name));
			methods[method] = isSource(method);
			if(globalContext != null)
				methods[globalContext.name].addCall(method.name, false);
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

	globalContext = methodContext;
}

function isSource(name)
{
	for(method in sources)
		if(sources[method] === name)
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
