var FunctionObject = require('./function_object');

/*
 * For parsing a esprima ast tree for different sink functions
 * @param { Object.AstBlock } ast the whole esprima parse tree to be parsed.
 * @param { Object.Analyzer } analyzer object given by te analyzer itself.
 */ 
function parseFunctions( ast, analyzer ) {
	var currentFunction;

	/*
	 * For returning one block towards the parent.
	 * @param { Object.AstBlock } astBlock contains the current esprima block.
	 */
	function walkUp( astBlock ) { 
		if ( astBlock.type === "FunctionDeclaration" ){
			currentFunction = currentFunction.parent;
		}
	}

	/*
	 * For traversing the tree downwards.
	 * @param { Object.AstBlock } astBlock contains the current esprima block.
	 */
	function walkDown( astBlock ) {
		if( astBlock.type === undefined ) {
			return;
		}
		if( astBlock.type === "FunctionDeclaration" ) {	
			if (currentFunction === undefined) {
				analyzer.wrapperFunction = new FunctionObject( astBlock, currentFunction, analyzer );
				currentFunction = analyzer.wrapperFunction;
			} else {
				currentFunction = new FunctionObject( astBlock, currentFunction, analyzer );	
			}
		}		
	}
	
	/* 
	 * Recursive function for traversing through the block structure.
	 * @param { Object.AstBlock } astBlock contains the current esprima block.
   */ 
	function rec( astBlock ) {
		if (astBlock === null || astBlock === undefined || astBlock.returnDependencies) {
			return;
		}
		walkDown( astBlock );
		var blockType = Object.prototype.toString.call(astBlock).slice(8, -1);
		if(blockType === "Object" || blockType === "Array") {
			for(var child in astBlock) {
				rec( astBlock[ child ] );
			}
		}
		walkUp( astBlock );
    }	
	rec( ast );
}

/*
function parseCalls( ast, analyzer ) {
	var currentFunction = undefined;
	
	// for returning to the parent.
	function walkUp( astBlock ) { 
		if ( astBlock.type === "FunctionDeclaration" )
			currentFunction = currentFunction.parent;
	}
	// for traversing the tree downwards.
	function walkDown( astBlock ) {
		if( astBlock.type === undefined )
			return;
		if( astBlock.type === "FunctionDeclaration" ) {	
			currentFunction = astBlock.functionObject;
		}
	}

    
	function rec( astBlock ) {
		if (astBlock === null)		
			return;
		walkDown( astBlock );
		
		var blockType = Object.prototype.toString.call(astBlock).slice(8, -1);
		if(blockType === "Object" || blockType === "Array")
			for(var child in astBlock) {
				rec( astBlock[ child ] );
			}

		walkUp( astBlock );	
	}
}
*/
module.exports = {
    parseFunctions: parseFunctions
//    parseCalls: parseCalls
};


