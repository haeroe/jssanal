var Identifier = require('./identifier');

function Dependency(id, type, args){
	this.identifier = id;
	this.type = type;

	args = args || {};
	this.block = args.block;
	this.arguments = args.arguments;
	this.sinks = args.sinks;
	this.realLocation = args.realLocation;
}

Dependency.prototype.resolve = function( context, args ) {
	if( this.type !== 'call')
		return true;

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
}

function fromParameter( index, context, list ){
	var id = index;
	var type = 'param';

	var d = new Dependency( id, type );
	list.push( d );
}

function findVariable( id, context ){
	if( context.variables[ id ] !== undefined )
		return context.variables[ id ];

	if( context.parent === undefined )
		return undefined;
	
	return findVariable( id, context.parent );
}

// parsii blokista identifierin stringinä
// tunnistaa funktiokutsut, muuttujien alustukset literaaleiksi, parametrit jne.
// selvittää parentista mistä riippuvuus oikeasti löytyy.
function fromBlock( block, context, list ){
	if (block === null)
		return;
	if (block.type === "Literal") 
		return;
	
	if (block.type === "Identifier"){
		var id = Identifier.parse(block);
		var type = "variable";

		var args = { realLocation: findVariable( id, context ) };
		
		var d = new Dependency( id, type, args );
		list.push( d );

	}
	if (block.type === "ExpressionStatement") {
		fromBlock( block.expression, context, list );
	}
	if (block.type === "FunctionDeclaration") {
		var id = Identifier.parse( block.id );
		var type = "function";

		var args = { block: block };

		var d = new Dependency( id, type, args );
		list.push( d );
	}
	if (block.type === "BinaryExpression"){
		// TODO
		//list.push( LEFT SIDE )
		//list.push( RIGHT SIDE );
	}
	if (block.type === "CallExpression"){
		var id = Identifier.parse(block.callee.property);
		var type = "call";

		var args = { arguments: [] };
		for(var i = 0; i < block.arguments.length; i++) {
			fromBlock( block.arguments[ i ], context, args.arguments );
		}
	}
}

module.exports = {
    fromParameter: fromParameter,
	fromBlock: fromBlock
};


