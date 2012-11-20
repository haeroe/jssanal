var Identifier = require('./identifier');
var Config = require('./configuration');
var _ = require('underscore');
var fs = require('fs');

function Dependency(id, type, args){
	this.identifier = id;
	this.type = type;

	args = args || {};
	this.block = args.block;
	this.argumentList = args.argumentList;
	this.sink = args.sink;
	this.realLocation = args.realLocation;

	this.resolved = false;
}

// reads a specific line from a file.
function readLine(filename, linenumber) {
	file = fs.readFileSync(filename, 'utf8');
    var lines = file.split("\n");
	if(linenumber-1 > lines.length){
		return;
	}		
	return lines[linenumber-1];
}

Dependency.prototype.resolve = function( context ) {
	var result = {
		recursion: false,
		unsafe: false
	};
//	console.log('no sehan oli hyva', this.identifier, this.type)
	if( this.type !== 'call')
		return true;
	
    if ( this.realLocation !== undefined ) {
		for(var i = 0; i < this.realLocation.length; i++){
	//	console.log(this.realLocation[i])
			var rloc = this.realLocation[ i ];
			if(rloc.type === "function") {
				if( rloc.sink === true ) {
					
					var line = readLine(this.block.loc.file, this.block.callee.loc.start.line);
					var result_object = {
						sourceFile: this.block.loc.file,
						lineNumber: this.block.callee.loc.start.line,
						vulnerableLine: line,
						sink: rloc.identifier,
						trace: context
					};
					
					var paramSafety = [];
					for(var p = 0; p < this.argumentList.length; p++){
						var safe = true;
						var argument = this.argumentList[ p ];
						for (var j = 0; j < argument.length; j++){
							var resolveResult = argument[ j ].resolve();
						}
					}
					context.analyzer.results.unsafeSinkCalls.push( result_object );
				}
				result.recursion = result.recursion && rloc.block.functionObject.resolveDependencies();
			}
		}
	}
	return result;

	/*
	var sources = [];
	for(var i = 0; i < args.length; i++){
		var list = [];
		sources.push( list );
		
		var rLocation = args[ i ].realLocation;
		if( rLocation !== undefined ){
			for(var p = 0; p < rLocation.length; p++){
				if( rLocation[ p ].type === 'function' ){
					var calledFunction = rLocation[ p ].block.functionObject;
					calledFunction.resolveDependencies();
					
				}
			}
		} else {
			console.log( "Unknown function ", args[ i ].identifier );
		}
	}
	*/
};

function fromParameter( index, context, list ){
	var id = index;
	var type = 'param';

	var d = new Dependency( id, type );
	list.push( d );
}

function findVariable( id, context ){
	if( context.variables[ id ] !== undefined ){
		return context.variables[ id ];
	}
	if( context.parent === undefined ){
		return undefined;
	}
	return findVariable( id, context.parent );
}

// parsii blokista identifierin stringinä
// tunnistaa funktiokutsut, muuttujien alustukset literaaleiksi, parametrit jne.
// selvittää parentista mistä riippuvuus oikeasti löytyy.
function fromBlock( block, context, list ){
//	console.log(block.type)
	var args, d, id, type;

	if (block === null){
		return;
	}
	if (block.type === "Literal"){
		return;
	}
	if (block.type === "Identifier"){
		id = Identifier.parse(block);
		type = "variable";
		
		d = new Dependency( id, type, args );
		list.push( d );

	}
	if (block.type === "ExpressionStatement") {
		fromBlock( block.expression, context, list );
	}
	if (block.type === "FunctionDeclaration") {
		id = Identifier.parse( block.id );
		type = "function";

		args = { block: block };

		if ( block.sink !== undefined ) {
			args.sink = true;
		} else {
			args.sink = false;
		}

		d = new Dependency( id, type, args );
		list.push( d );
	}
	if (block.type === "BinaryExpression"){
		/*// TODO (properly)
		type = 'binary';
		var binList = {};
		
		fromBlock( block.left, undefined, binList );
		fromBlock( block.right, undefined, binList );

		id = block.operator;
		d = new Dependency( id, type, binList );
		console.log(binList);
		list.push( d );*/
	}
	if (block.type === "CallExpression"){
		id = Identifier.parse(block.callee);

		type = "call";

		args = { argumentList: [], block: block };
		//block.arguments comes from parserAPI
		for(var i = 0; i < block.arguments.length; i++) {
			var argument = [];
			fromBlock( block.arguments[ i ], context, argument );
			args.argumentList.push( argument );
		}
	
		args.realLocation = findVariable(id, context);

		d = new Dependency( id, type, args );
		list.push( d );
	}
}

/*
function isFunctionSink(block) {
	if (block === null
	|| block.name === null
	|| block.name === undefined) {
		return false;
	}

	if(block.type === "MemberExpression") {
		var prop = block.property.name;
		var obj;

		if(block.object === "MemberExpression") {
		obj = block.object.property.name;
		} else {
		  obj = block.object.name;
		}

		var child = Config.memberFunctionSinks[prop];

		return (child === null) || _(child).contains(obj);
	}

	//if it's not a MemberExpression	

	id = block.name;
	return (_(Config.functionSinks).contains(id));
}
*/

module.exports = {
  fromParameter: fromParameter,
  fromBlock: fromBlock
};

