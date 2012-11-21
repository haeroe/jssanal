var testUtils = require('./testUtils');

exports['FunctioncallTests'] = {
  setUp: function(done) {
    done();
  },
  'testSinkCallLiteralParam': function(test) {
    var script  = "eval(1)";
	var results = testUtils.analyze(script);
	test.expect(2);
    test.equal(results.safe, true);
	test.ok(results.unsafeSinkCalls.length === 0);
    test.done();
  },
  'testSinkCallSafeDynamicParameter': function(test) {
    var script  = "var seppo = 5; eval(seppo);";
	var results = testUtils.analyze(script);
	test.expect(2);
    test.equal(results.safe, true);
	test.ok(results.unsafeSinkCalls.length === 0);
    test.done();
  },
  'testSinkCallUnsafeDynamicParameter': function(test) {
    var script  = "var seppo = outofscope; eval(seppo);";
	var results = testUtils.analyze(script);
	test.expect(2);
    test.equal(results.safe, false);
	test.ok(results.unsafeSinkCalls.length === 1);
    test.done();
  }
}

