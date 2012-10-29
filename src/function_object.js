var Identifier = require('identifier')

function FunctionObject( block, state, context ){
    var dependencies = [];
    var names = {}

    function getDependencies( block ){
		if(block.type === undefined)
			return;

		if(block.type === "FunctionDeclaration" || block.type === "FunctionExpression"){
			return;
		}
		if(block.type === "VariableDeclaration"){
			for( var i = 0, len = block.declarations.length; i < len; ++i){
				var declarator = block.declarations[ i ];
				var left = new Identifier( declarator.id, context ).index;
				if ( 
				var right = Dependency.fromBlock( declarator.init, context );

				names[ left ] = right;
			}
			return;
		}

		if(block.type === "ReturnStatement"){
			return names[ new Identifier( block.argument ) ];
		}

		for(var i in block){
			getDependencies( block[ i ] );
		}
    }

    getDependencies( block );
}

module.exports = FunctionObject;


