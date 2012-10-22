var filereader = require('../src/jsfinder.js');
var path = require('path');
var util = require('util');
var fs = require('fs');

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
  },
  'src folder with .jsp added': function(test) {
    fs.writeFileSync(testFolder + 'test.jsp', 'just a test');
    test.expect(1);
    test.equal(util.inspect(testArray), util.inspect(filereader), 'the .jsp file should not be included');
    test.done();
    fs.unlinkSync(testFolder + 'test.jsp');
  }
}
