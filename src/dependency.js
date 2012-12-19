var Identifier = require('./identifier');
//var Config     = require('./configuration');
var _          = require('./npm/underscore/1.4.2/package/underscore.js');
var fs         = require('fs');


/*
 * Initializes a new Dependency object.
 * @param { string } id textual representation parsed for the depedency. eg. 'variableB'.
 * @param { string } type eg. 'call' for a depenency parsed from a functionCallBlock.
 * @param { Object.Block } argument block parsed by esprima.
 * @constructor
 */
function Dependency(id, type, args){
    this.identifier = id;
    this.type = type;
    
    if (args === undefined)
        args = {};
    this.block = args.block;
    this.argumentList = args.argumentList;
    this.realLocation = args.realLocation;
	this.sink = args.sink;

    this.callerName = args.contextName;

    this.resolved = false;
}

/* 
 * Reads and returns a specific line as a string from a file.
 * @param { Object.Block } an esprima location block.
 * @param { integer } linenumber identifies the line you want to read.
 * @return { string } The actual line read from the input.
 */
function readLine(loc, linenumber) {
    if (loc.file === undefined ) { 
        return 'test';
    }
    var filename = loc.file;
    if (loc.file.substr(0,4) === 'url#') {
        filename = loc.file.substr(4); 
    }
    file = fs.readFileSync(filename, 'utf8');
    var lines = file.split("\n");
    if(linenumber-1 > lines.length){
        return;
    }		
    return lines[linenumber-1];
}

/*
 * Resolves safety of dependency in current context.
 * @param { Object.Block } Esprima block containing the 'parent' context.
 * @return { boolean } Whether expression return value is safe or not.
 */
Dependency.prototype.resolve = function( context ) {
    if( this.type !== 'variable' &&
		   	this.type !== 'property' &&
		   	this.type !== 'call' ){ 
		return true;
    }

	var safe = true;

    if( this.type === 'variable' || this.type === 'property' ){
        
		var rloc = this.realLocation;
		//if( rloc === undefined || rloc.length === 0)
		//	return false;
       
		if( rloc === undefined )
	        return false;
		if( rloc.length === 0 )
	        return true;
            
		for(var i = 0; i < rloc.length; i++){
			safe = safe && rloc[ i ].resolve( context );
		}
		return safe;
	}

    // get call dependencies
	if ( this.realLocation === undefined ) {
		return false;
	}
	for(var i = 0; i < this.realLocation.length; i++){

		var rloc = this.realLocation[ i ];

		if(rloc === undefined)
			continue;

		var functionObject;

		if(rloc.type === "param"){

			rloc = context.currentArguments[rloc.identifier][0].realLocation[0];
		}
		if(rloc.type === "function") {

			functionObject = rloc.block.functionObject;
		} else {
			continue;
		}
		functionObject.currentArguments = this.argumentList;

		var resolvedFunction = functionObject.resolveDependencies();
		if(resolvedFunction.isAlwaysUnsafeSink){
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
		if(!resolvedFunction.canReturnSafe && !resolvedFunction.argumentSink){
			return false;
		}
	

		var allSafe = true;

		var argumentSafetyList = [];
		for(var p = 0; p < this.argumentList.length; p++){
			//var argumentSafety = true;
			var argument = this.argumentList[ p ];

			for (var j = 0; j < argument.length; j++){

				//argumentSafety = argumentSafety && argument[ j ].resolve( context );

				// find sink call argument origin         
				if(rloc.sink === true){
					var rootFo = functionObject;
					while(rootFo.parent !== undefined){
						rootFo = rootFo.parent;    
					}

					// find func arguments sinked into sink func            
					function findCallerIdArgs(id, rootCalls){
						var rList = [[]];
						// it's recursion
						if (id === '0wrapper'){
							return rList;
						}
						for (var m in rootCalls){
							if(rootCalls[m].identifier !== id){
								for (var n in rootCalls[m].realLocation){

									if(rootCalls[m].realLocation[n].type !== 'function'){
										return rList;
									}     
									if (rootCalls[m].realLocation[n].block.type === 'FunctionDeclaration'){
										var nCalls = rootCalls[m].realLocation[n].block.functionObject.functionCalls;
										rList = findCallerIdArgs(id, nCalls);
									}

								}        
							}else{
								return rootCalls[m].argumentList; 
							}
						}
						return rList;
					}

					var sinkCallArgList = findCallerIdArgs( this.callerName, rootFo.block.functionObject.functionCalls );
					if (sinkCallArgList.length > 0 && sinkCallArgList[0].length > 0)
						allSafe = allSafe && sinkCallArgList[p][j].resolve( context );
				}
			}

			//argumentSafetyList.push( argumentSafety );

			//tmpAllSafe = tmpAllSafe && argumentSafety;
		}

		//console.log('resolve wut', functionObject.name);
		//console.log("resolve returns safe ", this.identifier, paramObject.returnsSafe);
		if(resolvedFunction.argumentReturn === true && !allSafe){
			safe = false;
		}
		//console.log(rloc);
		//console.log(rloc.identifier, rloc.sink);

		if( rloc.sink === true ){
			var line = readLine(this.block.loc, this.block.callee.loc.start.line);

			var result_object = {
				sourceFile: this.block.loc.file,
				lineNumber: this.block.callee.loc.start.line,
				vulnerableLine: line,
				sink: rloc.identifier,
				trace: context
			};

			if(allSafe){
				context.analyzer.results.safeSinkCalls.push( result_object );
			}else{
				context.analyzer.results.unsafeSinkCalls.push( result_object );
			}
		}
	}
	

	return safe;
};

/*
 * Generates a new dependency object from a parameter 
 *		and pushes it to the list of dependencies.
 * @param { string } index is the variable name.
 * @param { Object.Block } context contains the 'parent' context.
 * @param { Array.Dependency } list of dependencies for appending the results.
 */
function fromParameter( index, context, list ){
	var id = index;
	var type = 'param';

	var d = new Dependency( id, type );
	list.push( d );
}

/*
 * Recursive search for finding a variable from the parent context.
 * @param { string } id which the variable had when it was first met.
 * @param { Object.AstBlock } context esprima block where the variable search begins.
 * @return { FunctionObject.variables[Depedency1,..,DependencyN] } 
 *         list of the depedencies for the variable given in parent context.
 *         Undefined if the variable id was not found. 
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
 * Parses an ast block and generates the dependency objects for the listed block types.
 *		adds the dependency objects to the dependency list.
 * @param { Object.AstBlock } args block parsed by esprima.
 * @param { Object.AstBlock } context contains the parent information of current block.
 * @param { Array.Dependency } list is used for appending the results with the existing dependencies.
 */
function fromBlock( block, context, list ){
	var args, d, id, type;

	if (block === null || list === null || list === undefined || (list instanceof Array) === false){
		return;
	}
    else if (block.type === "Literal"){
		return;
	}
    else if (block.type === "Identifier"){
		id = Identifier.parse(block);
		type = "variable";

		args = {};
		args.realLocation = findVariable( id, context );

		d = new Dependency( id, type, args );
		list.push( d );
	}
    else if (block.type === "ExpressionStatement") {
		fromBlock( block.expression, context, list );
	}
    else if (block.type === "FunctionDeclaration") {
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
    else if(block.type === "BinaryExpression"){
        fromBlock(block.left, context, list);
        fromBlock(block.right, context, list);
    }
    else if(block.type === "MemberExpression"){
        id = Identifier.parse( block );
        type = 'property'

        args = {};
		args.realLocation = findVariable( id, context );
		
        d = new Dependency( id, type, args );
		list.push( d );
    }    
    //else if (block.type === "BinaryExpression"){
		/*// TODO (properly)
		type = 'binary';
		var binList = {};
		
		fromBlock( block.left, undefined, binList );
		fromBlock( block.right, undefined, binList );

		id = block.operator;
		d = new Dependency( id, type, binList );
		console.log(binList);
		list.push( d );*/
	//}
    else if (block.type === "CallExpression"){
        id   = (Identifier.parse(block.callee))
        if (id !== undefined) { 
            id = id.split('.').pop(); // currently only sink property of member funcs saved in realLocation
		}
        type = "call"
		args = { argumentList: [], block: block, contextName: context.name };
	    
        //block.arguments comes from parserAPI
		for(var i = 0; i < block.arguments.length; i++){
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
  readLine: readLine,
  fromParameter: fromParameter,
  fromBlock: fromBlock
};

