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
	test.ok(results.unsafeSinkCalls.length === 0, 
			"There should be no unsafeSinkCalls in the results since the parameter was a literal.");
    test.done();
  },
  'testSinkCallSafeDynamicParameter': function(test) {
    var script  = "var seppo = 5; eval(seppo);";
	var results = testUtils.analyze(script);
	test.expect(2);
    test.equal(results.safe, true);
	test.ok(results.unsafeSinkCalls.length === 0, 
			"There should be no unsafeSinkCalls in the results since the parameter variable was locally defined.");
    test.done();
  },
  'testSinkCallUnsafeDynamicParameter': function(test) {
    var script  = "var seppo = outofscope; eval(seppo);";
	var results = testUtils.analyze(script);
	test.expect(2);
    test.equal(results.safe, false);
	test.ok(results.unsafeSinkCalls.length === 1,
			"There should be a unsafeSinkCall in the results since the parameter variable was defined out of scope.");
    test.done();
  }
}

