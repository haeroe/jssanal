var State = require('./state');
var Parser = require('./parser');

function Analyzer(){
    this.state = new State();
    this.jobList = [];
}

Analyzer.prototype.add = function( astBlock ){
    this.jobList.push( astBlock );
}

Analyzer.prototype.config = function( options ){

}

Analyzer.prototype.process = function(){
    var combined_ast = {
        type: "Program",
        body: []
    };

    for(var jobNumber = 0, len = this.jobList.length; jobNumber < len; ++jobNumber){
        combined_ast.body.push( this.jobList[ jobNumber ].body );
    }

    Parser.parseFunctions( combined_ast, this.state );

    Parser.parseCalls( combined_ast, this.state );
}

Analyzer.prototype.report = function( log_f ){

}

module.exports = Analyzer;
