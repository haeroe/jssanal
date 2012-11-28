var analyze = require('./testUtils');

exports['pocTest'] = {
  setUp: function(done) {
    done();
  },
  'testLiteralCall': function(test) {
    var script  = "alert(1)";
	var results = analyze.analyze(script);
	test.expect(1);
    test.equal(results.unsafeSinkCalls.length, 0, ("test source: " + script) );
    test.done();
  },
  'testGlobalAssignment': function(test) {
	var script  = "var x=\"zap\"; alert(x);";
	var results = analyze.analyze(script);
    test.expect(1);
    test.equal(results.safe, true, ("test source: " + script) );
    test.done();
  },
  'testLocalAssignment': function(test) {
	var script  = "function f() { var x=\"zap\"; alert(x); }";
	var results = analyze.analyze(script);
    test.expect(1);
    test.equal(results.safe, true, ("test source: " + script) );
    test.done();
  }, 
  'testCircularAssignment': function(test) {
	var script  = "var x=\"zap\"; var y=x; x=y; alert(x);";
	var results = analyze.analyze(script);
    test.expect(1);
    test.equal(results.safe, true, ("test source: " + script) );
    test.done();
  }, 
  'testAssignmentFromFunctionReturn': function(test) {
	var script  = "var x=g(1); alert(x);\n" + "function g(y) { return y }";
	var results = analyze.analyze(script);
    test.expect(1);
    test.equal(results.safe, true, ("test source: " + script) );
    test.done();
  }, 
  'testFunctionFromAStructure': function(test) {
	var script  = "var functionContainer = {\n" + "  f : function() { return 100; }\n" + "}\n" +	"alert(functionContainer.f());";
	var results = analyze.analyze(script);
    test.expect(1);
    test.equal(results.safe, true, ("test source: " + script) );
    test.done();
  },
  'testNestedFunctionCalls': function(test) {
	var script  = "alert(g(1));\n" + "function g(y) { return y }";
	var results = analyze.analyze(script);
    test.expect(1);
    test.equal(results.safe, true, ("test source: " + script) );
    test.done();
  },
   'testRecursiveFunctionCalls': function(test) {
	var script  = "function f(x) { alert(x); f(x); }\n" + "f(1);";
	var results = analyze.analyze(script);
    test.expect(2);
    test.equal(results.safe, true, ("test source: " + script) );
	test.ok(results.recursiveExpressions.size !== 0);
    test.done();
  },
  'testIndirectlyRecursiveFunctionCalls': function(test) {
	var script  = "function f(x) { alert(x); g(x); }\n" + "function g(y) { f(y); }\n" + "f(1);";
	var results = analyze.analyze(script);
    test.expect(1);
    test.equal(results.safe, true, ("test source: " + script) );
    test.done();
  },
  'testArgumentValueFromFunctionParameter': function(test) {
	var script  = "g(1);\n" + "function g(y) { alert(y); }";
	var results = analyze.analyze(script);
    test.expect(1);
    test.equal(results.safe, true, ("test source: " + script) );
    test.done();
  },
  'testArgumentPassingFromEnclosingFunction': function(test) {
	var script  = "function enclosing(x) { unknown(function() { alert(x); }); }\n" + "enclosing(123);";
	var results = analyze.analyze(script);
    test.expect(1);
    test.equal(results.safe, true, ("test source: " + script) );
    test.done();
  },
  'testMultipleSafePossibleValues': function(test) {
	var script  = "function f() { var x=\"zap\"; x=\"foo\"; alert(x); }";
	var results = analyze.analyze(script);
    test.expect(1);
    test.equal(results.safe, true, ("test source: " + script) );
    test.done();
  },
  'testMultipleDifferentPossibleValuesForUnresolvedFunction': function(test) {
    var script  = "var x=123; x=unknown1(); alert(unknown2(x))";
    var results = analyze.analyze(script);
    test.expect(1);
	test.ok(results.unresolvedCalls.length !== 0)
    /*test.equal(analyze(script), 'UNRESOLVED(functionCall(global("unknown2"), tokens(SAFE()), 1)), UNRESOLVED(functionCall(global("unknown2"), tokens(UNRESOLVED(functionCall(global("unknown1"),tokens(), 1))), 1))'); */
    test.done();
  },
  'testMultipleArguments': function(test) {
	var script  = "alert(123, 456);";
	var results = analyze.analyze(script);
    test.expect(1);
    test.equal(results.safe, true, ("test source: " + script) );
    test.done();
  },
  'testFunctionVariable': function(test) {
	var script  = "var f = alert; f(123);";
	var results = analyze.analyze(script);
    test.expect(1);
    test.equal(results.safe, true, ("test source: " + script) );
    test.done();
  },
  'testCallback': function(test) {
    var script  = "function f(callback) { callback(123); } f(eval);";
    var results = analyze.analyze(script);
    test.expect(1);
	test.ok(results.safeSinkCalls.length !== 0);
    /*test.equal(analyze(script, 'f'), 'UNRESOLVED(global("alert"))');
    test.equal(analyze(script, 'alert'), 'SAFE');*/
    test.done();
  },
  'testChainedCalls': function(test) {
    var script  = "function f() { return obj; } f().method(123);";
    var results = analyze.analyze(script);
    test.expect(1);
	test.ok(results.unresolvedCalls.length !== 0);
    /*test.equal(analyze(script, 'f'), 'UNRESOLVED(global("alert"))');
    test.equal(analyze(script, 'alert'), 'SAFE');*/
    test.done();
  },
  'testChainedCalls': function(test) {
	var script  = "function f() { return obj; } f().method(123);";
	var results = analyze.analyze(script);
    test.expect(1);
    test.equal(results.safe, true, ("test source: " + script) );
    /*test.equal(analyze(script, 'obj.method'), 'SAFE');*/
    test.done();
  },
  'testFunctionReturn': function(test) {
	var script  = "function f() { return alert; }\n" + "var g = f(); g(123);";
	var results = analyze.analyze(script);
    test.expect(1);
    test.equal(results.safe, true, ("test source: " + script) );
    test.done();
  }
}

