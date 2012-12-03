var Identifier 	= require('./identifier');
var Dependency 	= require('./dependency');
var Config		= require('./configuration.js');
var _ 			= require('underscore');

/** @enum { integer } */
RESOLVED_NOT_VISITED = 0;
RESOLVED_VISITED = 1;
RESOLVED_DONE = 2;
RESOLVED_RECURSION = 3;

/*
 * Generates a function object for representing a single function found in the parsing process.
 * @param { Object.AstBlock } block contains the esprima parsed representation of the function.
 * @param { Object.AstBlock } parent contains the esprima parsed representation of the function.
 * @param { Object.Analyzer } analyzer object given by the analyzer itself in the function call.
 * @constructor
 */
function FunctionObject( block, parent, analyzer ){
	this.name = Identifier.parse( block.id );
	this.parent = parent; 
	this.block = block;
	block.functionObject = this;
	this.variables = {};
	this.returnDependencies = [];
	this.sourceDependencies = [];
	this.functionCalls = [];
	this.analyzer = analyzer;

	this.resolved = RESOLVED_NOT_VISITED;
	this.resolveResult = {};
	for ( var i = 0; i < block.params.length; i++ ) {
		var id = Identifier.parse(block.params[i]);
		this.variables[id] = [];
		Dependency.fromParameter( i, this, this.variables[id] ); 
	}
		
	this.getVariables( block );
    this.getDependencies( block );
	this.getCalls( block );
}

/*
 * Searches the block for Variable and Function declarations.
 * When such block is found the function initializes an array for the id
 *		in the current function object.
 * @param { Object.AstBlock } block contains the esprima parsed representation of the function.
 */
FunctionObject.prototype.getVariables = function( block ){
	if (block === null || block === undefined || block.returnDependencies){
		return;
	}
	if(block !== this.block){
		if(block.type === "VariableDeclaration"){
			for( var i = 0, len = block.declarations.length; i < len; ++i){
				var declaration = block.declarations[ i ];
				var left = Identifier.parse( declaration.id );
				if (this.variables[left] === undefined) {
					this.variables[left] = [];
				}
			}
			return;
		}
		if(block.type === "FunctionDeclaration") {
			var identifier = Identifier.parse( block.id );
			if (this.variables[identifier] === undefined) {
				this.variables[identifier] = [];
			}
			return;
		}
	}	
	for(var index in block){
		var blockType = Object.prototype.toString.call(block).slice(8, -1);
		if(blockType === "Object" || blockType === "Array") {
			this.getVariables( block[ index ] );
		}
	}

};

/*
 * Searches the given block for dependencies in variables, function statements and function return values.
 * When found their id's are added to the dependencies of the current function object.
 * @param { Object.AstBlock } block contains the esprima parsed representation of the function.
 */
FunctionObject.prototype.getDependencies = function( block ){
	if (block === null || block === undefined || block.returnDependencies){
		return;
	}
	
	if(block !== this.block){
		if(block.type === "VariableDeclaration"){
			for( var i = 0, len = block.declarations.length; i < len; ++i){
				var declarator = block.declarations[ i ];
				var left = Identifier.parse( declarator.id );
				Dependency.fromBlock( declarator.init, this, this.variables[left] );
			}
			return;
		}
		if(block.type === "FunctionDeclaration") {
			var identifier = Identifier.parse( block.id );
			Dependency.fromBlock( block, this, this.variables[ identifier ] );

			return;
		}
		if(block.type === "ReturnStatement"){
			Dependency.fromBlock( block.argument, this, this.returnDependencies );
			return;
		}
		if(block.type === "AssignmentExpression"){
			var result_object = {
						sourceFile: block.loc.file,
						lineNumber: block.loc.start.line,
						trace: this
						//vulnerableLine: line,
						//sink: rloc.identifier,
						//trace: context
			};
			
			var sinkResult = checkAsgSink(block.left);
			
			if(sinkResult.sink) {
				result_object.vulnerableLine = Dependency.readLine(block.loc, block.loc.start.line);
				result_object.sink = sinkResult.sink_name;
				this.analyzer.results.unsafeAssignments.push(result_object);
			}
		}
	}
	for(var index in block){
		var blockType = Object.prototype.toString.call(block).slice(8, -1);
		if(blockType === "Object" || blockType === "Array"){
			this.getDependencies( block[ index ] );
		}
	}

};

/*
 * Parses the block for function calls and makes a dependency object
 *		in the current function object when found.
 * @param { Object.AstBlock } block contains the esprima parsed representation of the function.
 */
FunctionObject.prototype.getCalls = function( block ) {
	if (block === null || block === undefined || block.returnDependencies)
		return;
	if(block !== this.block){
//		console.log(block.type);
		if( block.type === "FunctionDeclaration" ) {
			return;
		}

		if( block.type === "CallExpression" ) {
			Dependency.fromBlock( block, this, this.functionCalls );
		}
	}
	for(var i in block){
		var blockType = Object.prototype.toString.call(block).slice(8, -1);
		if(blockType === "Object" || blockType === "Array"){
			this.getCalls( block[ i ] );
		}
	}
};

/*
 * Goes through the current function objects list of dependencies 
 *		and function call ids and finds the sources for each of those.
 */
FunctionObject.prototype.resolveDependencies = function() {	
	//console.log('start', this.name );
	if(this.resolved === RESOLVED_DONE) {
		return this.resolveResult;
	}

	if(this.resolved === RESOLVED_VISITED){
		this.resolved = RESOLVED_RECURSION;
		
		//console.log('visited', this.name );

		this.resolveResult = {
			returnsSafe: false,
			isSink: true
		}

		return this.resolveResult;
	}

	if(this.resolved === RESOLVED_RECURSION){
		//console.log('rec', this.name );
		return this.resolveResult;
	}

	this.resolved = RESOLVED_VISITED;
		
	//console.log('main block', this.name );
	
//	console.log(this.functionCalls.length)	
	for(var i = 0; i < this.functionCalls.length; i++){
		var call = this.functionCalls[ i ];

		call.resolve( this );

		/*	
		if( !call.resolve( this ).recursion ){
			return ;
		}
		*/
	}

	for(i = 0; i < this.returnDependencies.length; i++){
		//this.sourceDependencies.push( source );
	}

	if(this.resolved === RESOLVED_VISITED){
		this.resolved = RESOLVED_DONE;

		this.resolveResult = {
			returnsSafe: true,
			isSink: false
		}
	}
	return this.resolveResult;
};

function checkAsgSink(block) {

	var result = {
		sink: false,
		sink_name: undefined	
	};

	if (block.type === "MemberExpression" ) {
		result.sink = (Config.memberAssignmentSinks[block.property.name] !== undefined);
				
		if(block.object.type === "MemberExpression") {
			result.sink_name = block.object.property.name + '.' + block.property.name;
		} else {
			result.sink_name = block.object.name + '.' + block.property.name;
		}
	} else {
		result.sink = _(Config.assignmentSinks).contains(block.name);
		
		result.sink_name = block.name;
	}
	
	return result;

	/*if(block.type === "MemberExpression") {
		var match = Config.memberAssignmentSinks[block.property.name];
		
		if(match == null) {
			return true;
		} else {
			if(block.object.type === "MemberExpression"
				&& _(match).contains(block.object.property.name)) {
				
			} else if (_(match).contains(block.object.name)) {
				
			}
		}
	} else {
		return (_(Config.assignmentSinks).contains(block.name));
	}
	
	return false;*/
}

module.exports = FunctionObject;

