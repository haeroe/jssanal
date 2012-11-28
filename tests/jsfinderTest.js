var filereader = require('../src/jsfinder.js');
var path = require('path');
var util = require('util');
var fs = require('fs');

var testFolder= path.normalize(__dirname + '/../src') + '/';
var testArray = [testFolder + 'configuration.js', testFolder + 'main.js', testFolder + 'jsfinder.js'];

exports['jsfinderTest'] = {
  setUp: function(done) {
	done();
  },
  'src folder with .jsp added': function(test) {
    fs.writeFileSync(testFolder + 'test.jsp', 'just a test');
    test.expect(1);
	var res = true;
	var str = util.inspect(filereader);
	if (str.indexOf('.jsp') != -1)
		res = false;
	test.ok(res);
    test.done();
    fs.unlinkSync(testFolder + 'test.jsp');
  }
}
