var fileReader = require('../src/jsfinder.js');
var urlReader  = require('../src/urlFinder.js');
var tUtil      = require('./testUtils');

var path = require('path');
var util = require('util');
var fs   = require('fs');
var util = require('util');

var doVersatile    = true;
var testGroupTitle = 'GET_FILES_TEST';

// for jsFinder tests
var testFolder= path.normalize(__dirname + '/../src') + '/';
var testArray = [testFolder + 'configuration.js', testFolder + 'main.js', testFolder + 'jsfinder.js'];

// for urlFinder tests
var testUrls = ['https://raw.github.com/cwolves/jQuery-iMask/master/dist/jquery-imask-min.js',
                'https://raw.github.com/haeroe/jssanal/master/examples/vector.js'];

exports['GET_FILES_TEST'] = {
    setUp: function(callback) {
        callback();
    },
  
    // jsFinder tests
    'src folder with .jsp added Test': function(test) {
        fs.writeFileSync(testFolder + 'test.jsp', 'just a test');
        var condition = true;
        var str       = util.inspect(fileReader);
        if (str.indexOf('.jsp') != -1) {
            res = false;
        }

        if (condition) { 
            tUtil.printTestOK(testGroupTitle, 
                              'src folder with .jsp added Test', 
                              undefined, 
                              undefined, 
                              doVersatile);
        }
        fs.unlinkSync(testFolder + 'test.jsp');
        test.expect(1);                
        test.ok(condition);
        test.done();
    },
   
    // urlFinder tests
    'get unknown file from external url Test': function(test) {
        var urlr = new urlReader(testUrls[0]); 
        var r    = 0;
    
        function parseUrlDataCb(result) {
            r = result.length;
        }       
        urlr.wget(parseUrlDataCb);

        (function(y) {
            setTimeout(function() { 
                //console.log('value:' + r);
                if (r > 0) { 
                    tUtil.printTestOK(testGroupTitle, 
                                      'get unknown file from external url Test', 
                                      'got file from ' + testUrls[0], 
                                      undefined, 
                                      doVersatile);
                }
 
                test.expect(1);
                test.ok(r > 0,'message: get url .js file contents length > 0');
                test.done();
            }, 900);
        })(r);
    },
    'get known file from external url Test': function(test) {
        var urlr    = new urlReader(testUrls[1]); 
        var r       = 0;
        var vecfile = fs.readFileSync('./examples/vector.js', 'ascii' );
        var resfile = '';

        function parseUrlDataCb(result) {
            r=result.length;
            resfile=result;
        }       
        urlr.wget(parseUrlDataCb);

        (function(y) {
            setTimeout(function() {
                 if ( (r > 0) && (vecfile === resfile) ) { 
                    tUtil.printTestOK(testGroupTitle, 
                                      'get known file from external url Test', 
                                      'got file from ' + testUrls[1], 
                                      undefined, 
                                      doVersatile);
                }
 
                test.expect(2);
                test.ok(r > 0, 'message: get url .js file contents through wget, contents should be > 0');
                test.deepEqual(vecfile, resfile, 'message: get url .js file contents known as vector.js');
                test.done();
            }, 900);
        })(r);
    }
  
};
