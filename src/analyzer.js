var Parser = require('./parser');

function Analyzer(){
	this.jobList = [];
	this.wrapperFunction = undefined;
}

Analyzer.prototype.add = function( astBlock ){
    this.jobList.push( astBlock );
}

Analyzer.prototype.config = function( options ){

}

Analyzer.prototype.process = function(){
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

    for(var jobNumber = 0, len = this.jobList.length; jobNumber < len; ++jobNumber){
        combined_ast.body.body.push( this.jobList[ jobNumber ].body );
    }

    Parser.parseFunctions( combined_ast, this );

    Parser.parseCalls( combined_ast, this );
}

Analyzer.prototype.report = function( log_f ){

}

module.exports = Analyzer;
