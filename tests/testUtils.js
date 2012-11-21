function analyze(str) {
    'use strict';
    var esprima  = require('esprima');
    var analyzer = new (require('../src/analyzer'))();
    var ast      = esprima.parse(str);      
    analyzer.add(ast);
    analyzer.process();
    analyzer.report();
    return analyzer.results;
}

module.exports = { 
    analyze: analyze 
};

