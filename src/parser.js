var FunctionObject = require('./function_object');

function parseFunctions( ast, state ){
		
		function walkUp() {
		
		}
		function walkDown() {
		
		}

    function rec( astBlock, state, parent ) {
		  if( astBlock.type === undefined )
            return;

        if( astBlock.type === "FunctionDeclaration" ){
            new FunctionObject( astBlock, state, parent );
            
        }
        //todo handle variable declaration and function assignment
        //need to do some experimenting with forms like a = 4, b = 9

        for(var child in astBlock){
						console.log(child);
            rec( astBlock[ child ], state, );
        }
    }
		rec(ast, state);
}

function parseCalls( ast, state ){

}

module.exports = {
    parseFunctions: parseFunctions,
    parseCalls: parseCalls
};


