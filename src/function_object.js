var Identifier = require('./identifier')
var Dependency = require('./dependency')

function FunctionObject( block, parent ){
	this.parent = parent;    
	this.block = block;
	this.variables = {};
	
	for ( var i = 0; i < block.params.length; i++ ) {
		this.variables[Identifier.parse(block.params[i].id)] = [Dependency.fromParameter(i)]; 
	}
    function getDependencies( block ){
		if(block.type === undefined)
			return;

		if(block.type === "VariableDeclaration"){
			for( var i = 0, len = block.declarations.length; i < len; ++i){
				var declarator = block.declarations[ i ];
				var left = Identifier.parse( declarator.id );
				var right = Dependency.fromBlock( declarator.init );
				if (this.variables[left] === undefined)
					this.variables[left] = [];
				this.variables[left].push(right);
			}
			return;
		}
		if(block.type === "FunctionDeclaration") {
			var identifier = Identifier.parse( block.id );
			var value = Dependency.fromBlock( block );
			if (this.variables[identifier] === undefined)
				this.variables[identifier] = [];
			this.variables[identifier].push(value);
		}
		if(block.type === "ReturnStatement"){
			return this.variables[ Identifier.parse( block.argument ) ];
		}

		if(block.type === "FunctionDeclaration" || block.type === "FunctionExpression"){
			return;
		}

		for(var i in block){
			getDependencies( block[ i ] ).call(this);
		}
    }
	getDependencies = getDependencies.bind(this);
    getDependencies( block );
}

module.exports = FunctionObject;


