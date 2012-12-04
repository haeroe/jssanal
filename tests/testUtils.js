'use strict';

function analyze(str) {
    var esprima  = require('esprima');
    var analyzer = new (require('../src/analyzer'))();
    var ast      = esprima.parse(str, {loc: true, range: true, raw: true, token: true} ); 
    analyzer.add(ast);
    analyzer.process();
    //analyzer.report();
    return analyzer.results;
};

// TODO: common test ok output
function printTestOK(title, message, source, doVersatile) {
    console.log('\n---------- ---------- ' + title + ': Passed ---------- ----------');
    if (doVersatile && message != undefined && message.length > 0)
        console.log('Message: [ ' + message + ' ]');
    if (doVersatile && source != undefined && source.length > 0)
        console.log('Source: [ ' + source + ' ]');
    //console.log('---------- ---------- ---------- ---------- ---------- ---------- ---------- ----------\n');
};

function getUrlContents(urlstr, cb) {
    var urlReader = new (require('../src/urlFinder.js'))(urlstr); 
    urlReader.wget(cb);
};

/*function parseUrlDataCb(result) {
    return result;
}*/

module.exports = { 
    analyze: analyze,
    printTestOK: printTestOK,
    getUrlContents: getUrlContents
};
