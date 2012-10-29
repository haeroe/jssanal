function Dependency(){

}

function fromParameter( index ){
    return new Dependency(index + "_parameter");
}

function fromId( id ){

}

module.exports = {
    fromParameter: fromParameter;
    fromId: fromId
};


