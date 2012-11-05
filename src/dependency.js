function Dependency(){

}

function fromParameter( index, type, context ){
    return new Dependency(index + "_parameter");
}

function fromBlock( block, context ){
	
}

module.exports = {
    fromParameter: fromParameter,
	fromBlock: fromBlock
};


