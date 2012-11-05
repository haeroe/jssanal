var util = require('util');

var Constants  = require('./constants');
var Identifier = require('./identifier')

function FunctionObject( block, state, context ){
    var dependencies = [];
    var names = {};
    
    function getDependencies( block ){

        console.log(' getDependencies('+block.type+'): ' + util.inspect(block)); 

        switch(block.type) {

            case undefined:
                break;
            // miten näiden dependenssit määritellään
            case 'FunctionDeclaration':
            case 'FunctionExpression':
            case 'BlockStatement':
            case 'ExpressionStatement':
            case 'CallExpression':
            case 'WithStatement':
            case 'TryStatement':
            case 'CatchClause':
                break;
            case 'VariableDeclaration':
                for (var i = 0, len = block.declarations.length; i < len; ++i){

                    var declarator = block.declarations[ i ];
                    var left       = new Identifier( declarator.id, context ).index;
                    //if ( 
                    var right      = Dependency.fromBlock( declarator.init, context );
                    names[ left ]  = right;
                }
                break;       
            case 'ReturnStatement':
                return names[ new Identifier( block.argument, context ) ];
                break;
            // talletetaanko näistä mitään
            case 'AssignmentExpression':
                break;
            case 'ObjectExpression': 
            case 'NewExpression':               
            case 'MemberExpression':            
            case 'UpdateExpression':
            case 'UnaryExpression':
            case 'BinaryExpression':
            case 'LogicalExpression':
            case 'ConditionalExpression':
            case 'SequenceExpression':
            case 'Identifier':
            case 'Literal':  // näitä ei ainakaan tarvita
                break;

            default:
                throw new Error('Unknown block type: ' + block.type);
        }    

        if (Constants.SyntaxKeys[block.type] != undefined) {
            for(var k in Object.keys(block)){
        
                var key = Object.keys(block)[k];                    
                if (key == 'type' || key == undefined) {
                    continue;
                }
               
                console.log('key: ' + key + ' block: ' + block[key] + ' type:' + typeof block[key]);
 
                for(var i in block[key]) {
                    getDependencies( block[key][i] );
                }
            }
        }
	    //for(var i in block){
		//    getDependencies( block[ i ] );
	    //}
    }

    for(var i in block){
        console.log('DEPENDS: ' + util.inspect(block[i],false,3));
        getDependencies( block[i] );
    } 


    function sayHello() {
        console.log('SAY Hello!');
    }    
}


module.exports = FunctionObject;
