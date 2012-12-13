/* 
 * Searches from block declaration's string type identifier.
 * @param( block ) Esprima parsed block.
 */
function parse( block ){
	if (block === undefined || block === null){
		return;
	}
	if (block.name !== undefined) {
		return block.name;
	} else if (block.property !== undefined && block.property.name !== undefined) {
		return block.property.name;
	} else if (block.type === "MemberExpression"){

        var ret = parseObjectId( block );
        if (ret === undefined)
            return;
        return ret;
    }
}

function parseObjectId( block ){
    if (block === undefined || block === null || block.type !== "MemberExpression"){
        return undefined;
    }
    var idList = [];
    if (block.property.type === "Identifier"){
        idList.unshift( block.property.name );
    }
    if (block.object.type === "Identifier"){
        idList.unshift( block.object.name );
    }
    else {
        var id = parseObjectId( block.object );

        if (id !== undefined)
            idList.unshift(id);
    } 
    if (idList.length === 0)
        return undefined;
    return idList.join('.');   
}    

module.exports = {
    parse: parse,
    parseObjectId: parseObjectId
};
