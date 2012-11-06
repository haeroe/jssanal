var Identifier = require('./identifier');

function Dependency(id, type, params){
	if (id === undefined || type === undefined)
		return;	
	this.identifier = id;
	this.type = type;
	if (params != undefined)
		this.params = params;
	console.log(this);
}

function fromParameter( index, type, context ){
	//console.log(index);
    return new Dependency();
}

// parsii blokista identifierin stringinä
// tunnistaa funktiokutsut, muuttujien alustukset literaaleiksi, parametrit jne.
// selvittää parentista mistä riippuvuus oikeasti löytyy.
function fromBlock( block, context ){
	if (block === null)
		return;
	if (block.name === "0wrapper")
		return;
	if (block.type === "Literal") {
		var id = block.value;
		var type = "literal";
	}	
	if (block.type === "Identifier"){
		var id = Identifier.parse(block);
		var type = "variable";
	}
	if (block.type === "FunctionDeclaration") {
		var id = block.id.name + "()";
		var type = "function declaration";
		var params = fromParameter(block.params);	
	}
	if (block.type === "CallExpression"){
		var id = Identifier.parse(block.callee.property);
		var type = "function call";
		var params = block.arguments;
	}
	return new Dependency(id, type, params);
}

module.exports = {
    fromParameter: fromParameter,
	fromBlock: fromBlock
};


