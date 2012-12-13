var Parser = require('./parser');
var Config = require('./configuration');
var _ = require('./npm/underscore/1.4.2/package/underscore.js');

/*
 * Analyzers main function is to receive the astBlocks to be analyzed and
 *		to have a datastructure for the results. Analyzer also implements the result
 *		reporting functionalities. 
 * @constructor
 */
function Analyzer(){
    this.jobList = []; // A queue for all the different ast trees to be analyzed.
    this.functionList = []; // A list of all functions for determining if everything has been analyzed.
    this.wrapperFunction = undefined;
    this.results = { 
        safeSinkCalls: [], 
        unresolvedCalls: [], 
        unsafeSinkCalls: [], 
        recursiveExpressions: [], 
        unsafeAssignments: [], 
        safeAssignments: [], 
        safe: true 
    };
}

/*
 * For adding the function objects to the functionList
 * @param { Object.FunctionObject } functionObject
 */
Analyzer.prototype.addFun = function( functionObject ) {
    this.functionList.push( functionObject );
};

/*
 * Adds an esprima ast tree to the analyzers queue waiting for analysis.
 * @param { Object.AstBlock } astBlock is a javascript source parsed to a ast tree by esprima.
 */
Analyzer.prototype.add = function( astBlock ){
    this.jobList.push( astBlock );
};

/*
 * Placeholder for future implementation of user configurable options.
 * @param { ? } options contains the users preferences.
 */
Analyzer.prototype.config = function( options ){

};

/*  
 *  Wraps all the input ast trees into a combined wrapper Object.
 *	Parses function calls and resolves the dependencies between the variables.
 */
Analyzer.prototype.process = function(){
    // the root
    var combined_ast = {
        type: "FunctionDeclaration",
        id: {
            type: "Identifier",
            name: "0wrapper"
        },
        body: {
            type: "BlockStatement",
            body: []
        },
        params: []
    };
    // function sinks
    _(Config.functionSinks).each(function(id){
        combined_ast.body.body.push({
            type: "FunctionDeclaration",
            sink: true,
            id: {
                type: "Identifier",
                name: id
            },
            body: {
                type: "BlockStatement",
                body: []    
            },
            params: []
        });
    });
    // member function sinks
    _(Config.memberFunctionSinks).map(function(val, key){
        var id = key; 
        //console.log(id); 
        combined_ast.body.body.push({
            type: "FunctionDeclaration",
            sink: true,
            id: {
                type: "Identifier",
                name: id
            },
            body: {
                type: "BlockStatement",
                body: []
            },
            params: []
        });
    });
    
    for(var jobNumber = 0, len = this.jobList.length; jobNumber < len; ++jobNumber){
        combined_ast.body.body.push( this.jobList[ jobNumber ].body );  
    }
    
    Parser.parseFunctions( combined_ast, this );

    combined_ast.functionObject.resolveDependencies();
    
    if (this.functionList.length != 0) {
        console.log('==============================\nUntested functions:\n==============================');
        var untested;
        for (var i = 0; i < this.functionList.length; i++) {
            if ( this.functionList[i].resolved === 0 && this.functionList[i].block.sink !== true) {
                console.log( '  ' + this.functionList[i].name + '()');
                untested = true;
                this.functionList[i].resolveDependencies();
            }
        }
        if (!untested) {
            console.log('  All function declarations were analyzed.  ');
        }
    }
};

/*
 *  Generates a simple summary of the analysis results and prints that to the standard output.
 */
Analyzer.prototype.report = function( log_f ){
    if (this.results.unsafeAssignments.length !== 0) {
        console.log('==============================\nUnsafe assignments to sinks:\n==============================');
        for (var i = 0; i < this.results.unsafeAssignments.length ; i++) {
            var curr = this.results.unsafeAssignments[i];
            console.log( '  ' + curr.sourceFile + ':' + curr.lineNumber + ' sink: ' + curr.sink  + ' line: "' + curr.vulnerableLine + '"' );
        }
    }
    if (this.results.safeAssignments.length !== 0) {
        console.log('==============================\nSafe assignments to sinks:\n==============================');
        for (var i = 0; i < this.results.safeAssignments.length ; i++) {
            var curr = this.results.safeAssignments[i];
            console.log( '  ' + curr.sourceFile + ':' + curr.lineNumber + ' sink: ' + curr.sink  + ' line: "' + curr.vulnerableLine + '"' );
        }
    }
    if (this.results.unsafeSinkCalls.length !== 0) {
        console.log('==============================\nUnsafe calls to sink functions:\n==============================');
        for (var i = 0; i < this.results.unsafeSinkCalls.length ; i++) {
            var curr = this.results.unsafeSinkCalls[i];
            console.log( '  ' + curr.sourceFile + ':' + curr.lineNumber + ' sink: ' + curr.sink  + '() line: "' + curr.vulnerableLine + '"' );
        }
    }
    if (this.results.safeSinkCalls.length !== 0) {
        console.log('==============================\nSafe calls to sink functions:\n==============================');
        for (var i = 0; i < this.results.safeSinkCalls.length ; i++) {
            var curr = this.results.safeSinkCalls[i];
            console.log( '  ' + curr.sourceFile + ':' + curr.lineNumber + ' sink: ' + curr.sink  + '() line: "' + curr.vulnerableLine + '"' );
        }
    }
    if (this.results.recursiveExpressions.length !== 0) {
        console.log('==============================\nRecursive expressions:\n==============================');
        for (var i = 0; i < this.results.recursiveExpressions.length ; i++) {
            var curr = this.results.recursiveExpressions[i];
            console.log( '  ' + curr.sourceFile + ':' + curr.lineNumber + ' sink: ' + curr.sink );  
        }
    }
};

module.exports = Analyzer;
