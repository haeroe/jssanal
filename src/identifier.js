/* 
 * Searches from block declaration's string type identifier.
 * @param( block ) Esprima parsed block.
 */
function parse( block ){
	if (block === undefined || block === null){
		return;
	}
    if (block.type === "MemberExpression"){
        var ret = parseObjectId( block );
        if (ret !== undefined)
            return ret;
    }
    if (block.name !== undefined) {
		return block.name;
	} 
    if (block.property !== undefined && block.property.name !== undefined) {
		return block.property.name;
	} 
    return;
}

function parseObjectId( block ){
    if (block === undefined || block === null || block.type !== "MemberExpression"){
        return undefined;
    }

    var idList = [];
    if (block.property.type === "Identifier"){
        idList.unshift( block.property.name );
    }else{
        var id1 = parseObjectId( block.property );
        if (id1 !== undefined)
            idList.unshift(id1);
    }

    if (block.object.type === "Identifier"){
        idList.unshift( block.object.name );
    }else{
        var id2 = parseObjectId( block.object );
        if (id2 !== undefined)
            idList.unshift(id2);
    }

    if (idList.length === 0){
        return undefined;
    }
    return idList.join('.');   
}    

module.exports = {
    parse: parse,
    parseObjectId: parseObjectId
};
