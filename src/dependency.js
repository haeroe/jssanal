var Identifier = require('./identifier');

function Dependency(id, type, args){
	this.identifier = id;
	this.type = type;

	args = args || {};
	this.block = args.block;
	this.argumentList = args.argumentList;
	this.sinks = args.sinks;
}

Dependency.prototype.resolve = function( context, args ) {

};

function fromParameter( index, context, list ){
	var id = index;
	var type = 'param';

	var d = new Dependency( id, type );
	list.push( d );
}

function findVariable( id, context ){
	if( context.variables[ id ] !== undefined ){
		return context.variables[ id ];
	}
	if( context.parent === undefined ){
		return undefined;
	}
	return findVariable( id, context.parent );
}

// parsii blokista identifierin stringinä
// tunnistaa funktiokutsut, muuttujien alustukset literaaleiksi, parametrit jne.
// selvittää parentista mistä riippuvuus oikeasti löytyy.
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
		
		d = new Dependency( id, type );
		list.push( d );

	}
	if (block.type === "ExpressionStatement") {
		fromBlock( block.expression, context, list );
	}
	if (block.type === "FunctionDeclaration") {
		id = Identifier.parse( block.id );
		type = "function";

		args = { block : block };

		d = new Dependency( id, type, args );
		list.push( d );
	}
	if (block.type === "BinaryExpression"){
		// TODO
		//list.push( LEFT SIDE )
		//list.push( RIGHT SIDE );
	}
	if (block.type === "CallExpression"){
		id = Identifier.parse(block.callee.property);
		type = "call";

		args = { argumentList: [], sinks: [] };
		for(var i = 0; i < block.argumentList.length; i++) {
			fromBlock( block.argumentList[ i ], context, args.argumentList );
		}
		
		if ( id === "sink" ) {
			args.sinks = fromParameter();
		}
	}
}

module.exports = {
    fromParameter: fromParameter,
	fromBlock: fromBlock
};


