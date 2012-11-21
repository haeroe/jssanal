var testUtils = require('./testUtils');

exports['FunctioncallTests'] = {
  setUp: function(done) {
    done();
  },
  'testLiteralCall': function(test) {
    var script  = "eval(1)";
	var results = testUtils.analyze(script);
	test.expect(1);
    test.equal(results.safe, true);
    test.done();
  }
}
