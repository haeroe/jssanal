var util = require('util');

var State  = require('./state');
var Parser = require('./parser');

function Analyzer(){
    this.state = new State(); // täällä kaikki kerätty data ?
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

    combined_ast.body = this.jobList[0].body;

    // jobNumber ?
    //for(var jobNumber = 1, len = this.jobList.length; jobNumber < len; ++jobNumber){
    //    combined_ast.body.push( this.jobList[jobNumber].body );
    //}
    console.log('combined_ast: ' + util.inspect(combined_ast.body, false) + '\n');

    Parser.parseFunctions( combined_ast.body, this.state );

    Parser.parseCalls( combined_ast, this.state );
}

Analyzer.prototype.report = function( log_f ){

}

module.exports = Analyzer;


