var FunctionObject = require('./function_object');

function parseFunctions( ast, analyzer ){
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
        	if( astBlock.type === "FunctionDeclaration" ){
        	    currentFunction = new FunctionObject( astBlock, currentFunction, analyzer );
        	}
        }
		

    function rec( astBlock ) {		
		walkDown( astBlock );

        for(var child in astBlock){
            rec( astBlock[ child ] );
        }

		walkUp( astBlock );
    }	
		rec( ast );
}

function parseCalls( ast, analyzer ){

}

module.exports = {
    parseFunctions: parseFunctions,
    parseCalls: parseCalls
};


