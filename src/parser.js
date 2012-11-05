var util = require('util');
var FunctionObject = require('./function_object');

function parseFunctions( ast, state ){

    function rec( astBlock, state, context ){

        console.log('\nparseFunctions().REC('+ astBlock.type + ' len:' + astBlock.length + ')' 
                    + ' BLOCK: ' + util.inspect(astBlock,false,5)); //+' context: '+context);

        if( astBlock.type === undefined )
            return;

        if( astBlock.type === "FunctionDeclaration" ){
            new FunctionObject( astBlock, state, context );

            context.push(astBlock.id);
        }
        //todo handle variable declaration and function assignment
        //need to do some experimenting with forms like a = 4, b = 9
    }

    context = [{
		//"type": "Identifier",
        //"name": "window"
        }];
    
    for(var i in ast){
        rec(ast[i], state, context);
    }
}

function parseCalls( ast, state ){

}

module.exports = {
    parseFunctions: parseFunctions,
    parseCalls: parseCalls
};


