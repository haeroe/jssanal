var Identifier = require('./identifier')

function FunctionObject( block, parent ){
	this.parent = parent;    
	this.block = block;
	this.variables = {};

    function getDependencies( block ){
		if(block.type === undefined)
			return;

		if(block.type === "VariableDeclaration"){
			for( var i = 0, len = block.declarations.length; i < len; ++i){
				var declarator = block.declarations[ i ];
				var left = new Identifier( declarator.id, context ).index;
				var right = Dependency.fromBlock( declarator.init, context );
				if (names[ left ] = right) {
					console.log('left=right')				
				}
			}
			return;
		}

		if(block.type === "ReturnStatement"){
			return names[ new Identifier( block.argument ) ];
		}

		if(block.type === "FunctionDeclaration" || block.type === "FunctionExpression"){
			return;
		}

		for(var i in block){
			getDependencies( block[ i ] );
		}
    }

    getDependencies( block );
}

module.exports = FunctionObject;


