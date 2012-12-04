// hakee blokista stringimuotoisen identifierin.
function parse( block ){
	if (block === undefined || block === null){
		return;
	}
	if (block.name !== undefined) {
		return block.name;
	} else if (block.property !== undefined && block.property.name !== undefined) {
		return block.property.name;
	}
	
}

module.exports = {
	parse: parse
};
