var filereader = require('../src/jsfinder.js');
var path = require('path');
var util = require('util');

exports['awesome'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'no args': function(test) {
    test.expect(1);
    // tests here
    test.equal('awesome', 'awesome', 'should be awesome.');
    test.done();
  }
};

var testFolder= path.normalize(__dirname + '/../src') + '/';
var testArray = [testFolder + 'main.js', testFolder + 'jsfinder.js'];
exports['jsfinder'] = {
  setUp: function(done) {
    done();
    
  },
  'src folder': function(test) {
    test.expect(1);
    test.equal(util.inspect(testArray), util.inspect(filereader), 'the folderlisting should be the same');
    test.done();
  }}
