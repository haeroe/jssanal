var testUtils = require('./testUtils');

exports['simpleSinks'] = {
  setUp: function(done) {
    done();
  },
  'testSinkCallLiteralParam': function(test) {
    var script  = "eval(1)";
	var results = testUtils.analyze(script);
	test.expect(2);
    test.equal(results.safe, true);
	test.ok(results.safeSinkCalls.length !== 0, "test source:[ " + script + "]" );
    test.done();
  },
  'testSinkCallSafeDynamicParameter': function(test) {
    var script  = "var seppo = 5; eval(seppo);";
	var results = testUtils.analyze(script);
	test.expect(1);
	test.ok(results.safeSinkCalls.length !== 0, "test source:[ " + script + "]" );
    test.done();
  },
  'testSinkCallUnsafeDynamicParameter': function(test) {
    var script  = "var seppo = outofscope; eval(seppo);";
	var results = testUtils.analyze(script);
	test.expect(1);
	test.ok(results.unsafeSinkCalls.length !== 0, "test source:[ " + script + "]" );
    test.done();
  },
	'testSinkCallSafeFunctionReturnValue': function(test) {
    var script  = "function f() { return 'safe'; } eval(f());";
	var results = testUtils.analyze(script);
	test.expect(1);
	test.ok(results.safeSinkCalls.length !== 0, "test source:[ " + script + "]" );
    test.done();
  },
  'testAssignmentSinkSafeValue': function(test) {
    var script  = "var localVar = 'also safe'; document.URL = localVar;";
	var results = testUtils.analyze(script);
	test.expect(1);
	test.ok(results.safeAssignments.length !== 0, "test source:[ " + script + "]" );
    test.done();
  },
  'testAssignmentSinkVariableOutOfScope': function(test) {
    var script  = "document.URL = outofscope;";
	var results = testUtils.analyze(script);
	test.expect(2);
    test.equal(results.safe, false);
	test.ok(results.safeAssignments.length === 0, "test source:[ " + script + "]" );
    test.done();
  },
  'testAssignmentSinkSafeValueFromFunctionReturn': function(test) {
    var script  = "function f() { return 'safe'; } document.write = f();";
	var results = testUtils.analyze(script);
	test.expect(1);
	console.log(results.unsafeAssignments);
	test.ok(results.safeAssignments.length !== 0, "test source:[ " + script + "]" );
    test.done();
  }

}

