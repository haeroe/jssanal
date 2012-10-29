var FunctionObject = require('function_object');

function parseFunctions( ast, state ){

    function rec( astBlock, state, context ) {
        if( astBlock.type === undefined )
            return;

        if( astBlock.type === "FunctionDeclaration" ){
            new FunctionObject( astBlock, state, context );

            context = astBlock.id;
        }
        //todo handle variable declaration and function assignment
        //need to do some experimenting with forms like a = 4, b = 9

        for(var child in astBlock){
            rec( astBlock[ child ], state, context );
        }
    }

    context = {
                  "type": "Identifier",
                  "name": "window"
              };


}

function parseCalls( ast, state ){

}

module.exports = {
    parseFunctions: parseFunctions,
    parseCalls: parseCalls
};


