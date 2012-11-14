var Parser = require('./parser');
var Config = require('./configuration');
var _ = require('underscore');

function Analyzer(){
	this.jobList = [];
	this.wrapperFunction = undefined;
}

Analyzer.prototype.add = function( astBlock ){
    this.jobList.push( astBlock );
};

Analyzer.prototype.config = function( options ){

};

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
		}
		)
	});
	
	/*	
	_(Config.memberFunctionSinks).each(function(id){
		combined_ast.body.body.push({
			type: "FunctionDeclaration",
			sink:true,
			id: {
				type: "Identifier",
				name: id
			},
			body: {
				type: "BlockStatement",
				body: []
			},
			params: []
		}
		)
	});
	*/
	for(var jobNumber = 0, len = this.jobList.length; jobNumber < len; ++jobNumber){
		combined_ast.body.body.push( this.jobList[ jobNumber ].body );
	}

	Parser.parseFunctions( combined_ast, this );

	combined_ast.functionObject.resolveDependencies();

};

Analyzer.prototype.report = function( log_f ){

};

module.exports = Analyzer;
