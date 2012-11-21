var Identifier = require('./identifier');
var Dependency = require('./dependency');

RESOLVED_NOT_VISITED = 0;
RESOLVED_VISITED = 1;
RESOLVED_DONE = 2;
RESOLVED_RECURSION = 3;

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
 * searches the block for Variable and Function declarations.
 * when such block is found the function initializes an array for the id
 * in the current function object.
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
 * searches the given block for dependencies in variables, function statements and function return values
 * when found their id's are added to the dependencies of the current function object.
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
	}
	for(var index in block){
		var blockType = Object.prototype.toString.call(block).slice(8, -1);
		if(blockType === "Object" || blockType === "Array"){
			this.getDependencies( block[ index ] );
		}
	}

};

/*
 * parses the block for function calls and makes a dependency object
 * in the current function object when found.
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
 * goes through the current function objects list of dependencies 
 * and function call ids and finds the sources for each of those.
 */
FunctionObject.prototype.resolveDependencies = function() {
	if(this.resolved === RESOLVED_DONE) {
		return this.resolveResult;
	}

	if(this.resolved === RESOLVED_VISITED){
		this.resolved = RESOLVED_RECURSION;


		
		return this.resolveResult;
	}

	if(this.resolved === RESOLVED_RECURSION){
		return this.resolveResult;
	}

	this.resolved = RESOLVED_VISITED;
	
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

	this.resolved = RESOLVED_DONE;
	return this.resolveResult;
};

module.exports = FunctionObject;

