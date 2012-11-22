var Identifier = require('./identifier');
var Config = require('./configuration');
var _ = require('underscore');
var fs = require('fs');

/*
 * initializes a new Dependency object.
 */
function Dependency(id, type, args){
	this.identifier = id;	// the identifier should be a string eg. 'variableB'.
	this.type = type;		// the type of the dependency as a string eg. 'param', 'call'.
    if (args === undefined)
	  args = {};
	this.block = args.block;
	this.argumentList = args.argumentList;
	this.sink = args.sink;
	this.realLocation = args.realLocation;

	this.resolved = false;
}

/* 
 * reads and returns a specific line as a string from a file.
 */
function readLine(loc, linenumber) {
	if (loc.file === undefined ) {
	   return 'test';
	}
	file = fs.readFileSync(loc.filename, 'utf8');
    var lines = file.split("\n");
	if(linenumber-1 > lines.length){
		return;
	}		
	return lines[linenumber-1];
}

/*
 * resolves safety of dependency in current context.
 * Writes sink calls to results.
 * Return whether expression return value is safe or not.
 */
Dependency.prototype.resolve = function( context ) {
	var safe = true;

	if( this.type === 'variable' ){
		var rloc = this.realLocation;
		if( rloc === undefined )
			return false;
		for(var i = 0; i < rloc.length; i++){
			safe = safe && rloc[ i ].resolve( context );
		}
		return safe;
	}

	if( this.type !== 'call')
		return true;
    if ( this.realLocation !== undefined ) {
		for(var i = 0; i < this.realLocation.length; i++){
			var rloc = this.realLocation[ i ];
			if(rloc.type === "function") {

				var functionObject = rloc.block.functionObject;

				var argumentSafetyList = [];
				for(var p = 0; p < this.argumentList.length; p++){
					var argumentSafety = true;
					var argument = this.argumentList[ p ];
					for (var j = 0; j < argument.length; j++){
						argumentSafety = argumentSafety && argument[ j ].resolve( context );
					}
					argumentSafetyList.push( argumentSafety );
				}
				
				var paramObject = functionObject.resolveDependencies();

				if( rloc.sink === true ) {

					var line = readLine(this.block.loc, this.block.callee.loc.start.line);
					var result_object = {
						sourceFile: this.block.loc.file,
						lineNumber: this.block.callee.loc.start.line,
						vulnerableLine: line,
						sink: rloc.identifier,
						trace: context
					};

					context.analyzer.results.unsafeSinkCalls.push( result_object );
				}
			}
		}
	}
	return safe;

};

/*
 * generates a new dependency object from a parameter 
 * and pushes it to the list of dependencies.
 */
function fromParameter( index, context, list ){
	var id = index;
	var type = 'param';

	var d = new Dependency( id, type );
	list.push( d );
}

/*
 * recursive search for finding a variable from the parent context.
 */
function findVariable( id, context ){
	if( context.variables[ id ] !== undefined ){
		return context.variables[ id ];
	}
	if( context.parent === undefined ){
		return undefined;
	}
	return findVariable( id, context.parent );
}

/* 
 * parses a ast block and generates the dependency objects for the listed block types.
 * adds the dependency objects to the dependency list.
 */
function fromBlock( block, context, list ){
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
		
		args = {};

		args.realLocation = findVariable( id, context );

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

