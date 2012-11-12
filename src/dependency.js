var Identifier = require('./identifier');
var Config = require('./configuration');
var _ = require('underscore');

function Dependency(id, type, args){
	this.identifier = id;
	this.type = type;

	args = args || {};
	this.block = args.block;
	this.argumentList = args.argumentList;
	this.sinks = args.sinks;
	this.realLocation = args.realLocation;
}

Dependency.prototype.resolve = function( context, args ) {
//	console.log('no sehan oli hyva', this.identifier, this.type)
	if( this.type !== 'call')
		return true;
	
	var ret = true;
    if ( this.realLocation !== undefined ) {
		for(var i = 0; i < this.realLocation.length; i++){
//		console.log(this.realLocation[i])
			if(this.realLocation[ i ].block.type === "FunctionDeclaration") {
				ret = ret && this.realLocation[ i ].block.functionObject.resolveDependencies();

			}
		}
	}
	return ret;

	/*
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
	*/
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
//	console.log(block.type)
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
		
		d = new Dependency( id, type, args );
		list.push( d );

	}
	if (block.type === "ExpressionStatement") {
		fromBlock( block.expression, context, list );
	}
	if (block.type === "FunctionDeclaration") {
		id = Identifier.parse( block.id );
		type = "function";

		args = { block: block };

		d = new Dependency( id, type, args );
		list.push( d );
	}
	if (block.type === "BinaryExpression"){
		// TODO
		//list.push( LEFT SIDE )
		//list.push( RIGHT SIDE );
	}
	if (block.type === "CallExpression"){
		id = Identifier.parse(block.callee);

		if (_(Config.functionSinks).contains(id)){
			console.log("Call to a sink function found: " + id );
		}
	   	if (block.callee.property !== undefined && _(Config.memberFunctionSinks).contains(block.callee.property.name) ) {
			console.log("Call to a MemberFunction sink found: " + block.callee.property.name);
		}

		type = "call";

		args = { argumentList: [] };
		//block.arguments comes from parserAPI
		for(var i = 0; i < block.arguments.length; i++) {
			fromBlock( block.arguments[ i ], context, args.argumentList );
		}
	
		args.realLocation = findVariable(id, context);

		d = new Dependency( id, type, args );
		list.push( d );
	}
}

module.exports = {
    fromParameter: fromParameter,
	fromBlock: fromBlock
};


