var Identifier = require('./identifier');
var Dependency = require('./dependency');

RESOLVED_NOT_VISITED = 0;
RESOLVED_VISITED = 1;
RESOLVED_DONE = 2;
RESOLVED_RECURSION = 3;

function FunctionObject( block, parent ){
	this.name = Identifier.parse( block.id );
	this.parent = parent;    
	this.block = block;
	block.functionObject = this;
	this.variables = {};
	this.returnDependencies = [];
	this.sourceDependencies = [];
	this.functionCalls = [];

	this.resolved = RESOLVED_NOT_VISITED;

	for ( var i = 0; i < block.params.length; i++ ) {
		var id = Identifier.parse(block.params[i]);
		Dependency.fromParameter( i, this, this.variables[id] ); 
	}
		
	this.getVariables( block );
    this.getDependencies( block );
	this.getCalls( block );
}

FunctionObject.prototype.getVariables = function( block ){
	
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
	
	for(var i in block){
		var blockType = Object.prototype.toString.call(block).slice(8, -1);
		if(blockType === "Object" || blockType === "Array") {
			this.getVariables( block[ i ] );
		}
	}

};

FunctionObject.prototype.getDependencies = function( block ){
		
	if(block === undefined || block === null) {
			return;
	}
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

	for(var i in block){
		var blockType = Object.prototype.toString.call(block).slice(8, -1);
		if(blockType === "Object" || blockType === "Array"){
			this.getDependencies( block[ i ] );
		}
	}

};

FunctionObject.prototype.getCalls = function( block ) {

	if( block.type === "FunctionDeclaration" ) {
		return;
	}

	if( block.type === "CallExpression" ) {
		this.functionCalls.push( Dependency.fromBlock( block ) );
	}
	
	for(var i in block){
		var blockType = Object.prototype.toString.call(block).slice(8, -1);
		if(blockType === "Object" || blockType === "Array"){
			this.getCalls( block[ i ] );
		}
	}
};

FunctionObject.prototype.resolveDependencies = function() {
	if(this.resolved === RESOLVED_DONE) {
		return true;
	}

	if(this.resolved === RESOLVED_VISITED){
		this.resolved = RESOLVED_RECURSION;
		console.log("Recursion! Function: ", this.name);
		return false;
	}

	if(this.resolved === RESOLVED_RECURSION){
		return false;
	}

	this.resolved = RESOLVED_VISITED;

	for(var i = 0; i < this.functionCalls.length; i++){
		if(!this.functionCalls[ i ].resolve()){
			this.resolved = RESOLVED_RECURSION;
			console.log("Recursion! Function: ", this.name);
			return false;
		}
	}

	for(i = 0; i < this.returnDependencies.length; i++){
		//this.sourceDependencies.push( source );
	}

	this.resolved = RESOLVED_DONE;
	return true;
};

module.exports = FunctionObject;


