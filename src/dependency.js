var Identifier = require('./identifier');
var Config     = require('./configuration');
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
    this.sink = args.sink;
    this.realLocation = args.realLocation;

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
        var DOWNLOAD_DIR = './url_downloads/';
        if ( fs.existsSync(DOWNLOAD_DIR) === false ) {
            return loc.file; 
        }    
        filename = DOWNLOAD_DIR + loc.file.substr(4); 
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
	var safe = true;
	if( this.type === 'variable' ){
		var rloc = this.realLocation;
		if( rloc === undefined || rloc.length === 0)
			return false;

		for(var i = 0; i < rloc.length; i++){
			safe = safe && rloc[ i ].resolve( context );
		}
		return safe;
	}

	if( this.type !== 'call')
		return true;
	// get call depedencies
	if ( this.realLocation === undefined ) {
		safe = false;	
	}
	if ( this.realLocation !== undefined ) {
		for(var i = 0; i < this.realLocation.length; i++){

			var rloc = this.realLocation[ i ];
			//console.log('resolve call', this.identifier);

			if(rloc === undefined)
				continue;

			if(rloc.type === "function") {

				var functionObject = rloc.block.functionObject;

				var tmpAllSafe = true;

				var argumentSafetyList = [];
				for(var p = 0; p < this.argumentList.length; p++){
					var argumentSafety = true;
					var argument = this.argumentList[ p ];
					for (var j = 0; j < argument.length; j++){
						argumentSafety = argumentSafety && argument[ j ].resolve( context );
					}
					//console.log(argumentSafety);
					argumentSafetyList.push( argumentSafety );

					tmpAllSafe = tmpAllSafe && argumentSafety;
				}
				//console.log('wut', functionObject.name);	
				var paramObject = functionObject.resolveDependencies();
				//console.log("returns safe ", this.identifier, paramObject.returnsSafe);
				if(paramObject.returnsSafe === false){
					safe = false;
				}
				if( rloc.sink === true ) {

					var line = readLine(this.block.loc, this.block.callee.loc.start.line);

					var result_object = {
                        sourceFile: this.block.loc.file,
						lineNumber: this.block.callee.loc.start.line,
						vulnerableLine: line,
						sink: rloc.identifier,
						trace: context
					};

					if(tmpAllSafe){
						context.analyzer.results.safeSinkCalls.push( result_object );
					}else{
						context.analyzer.results.unsafeSinkCalls.push( result_object );
					}
				}
			}
		}
	}

	return safe;
};

/*
 * Generates a new dependency object from a parameter 
 *		and pushes it to the list of dependencies.
 * param { string } index is the variable name.
 * param { Object.Block } context contains the 'parent' context.
 * param { Array.Dependency } list of dependencies for appending the results.
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
 * @return { string } The actual id of the found variable, undefined if not found.
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

	if (block === null || list == null){
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
		id   = Identifier.parse(block.callee);
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
  readLine: readLine,
  fromParameter: fromParameter,
  fromBlock: fromBlock
};

