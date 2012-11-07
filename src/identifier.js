// hakee blokista stringimuotoisen identifierin.
function parse( block ){
	if (block !== undefined && block !== null){
		return block.name;
	}
}

module.exports = {
	parse: parse
};
