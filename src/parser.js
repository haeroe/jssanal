var FunctionObject = require('./function_object');

function parseFunctions( ast, analyzer ) {
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
				if (currentFunction === undefined) {
					analyzer.wrapperFunction = new FunctionObject( astBlock, currentFunction );
					currentFunction = analyzer.wrapperFunction;
				} else {
					currentFunction = new FunctionObject( astBlock, currentFunction );	
				}
        	}
        }
		

    function rec( astBlock ) {		
		walkDown( astBlock );
		console.log(astBlock);
		if(astBlock != undefined)
			return;
        for(var child in astBlock) {	
            rec( astBlock[ child ] );
        }

		walkUp( astBlock );
    }	
		rec( ast );
}

function parseCalls( ast, analyzer ) {

}

module.exports = {
    parseFunctions: parseFunctions,
    parseCalls: parseCalls
};


