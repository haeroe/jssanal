exports['ParseTest'] = {
  setUp: function(done) {
    done();
  },
  'testLiteralCall': function(test) {
    var script == "alert(1)";
	 test.expect(1);
    test.equal(analyze(script), 'SAFE');
    test.done();
  },
  'testGlobalAssignment': function(test) {
	 var script = "var x=\"zap\"; alert(x);";
    test.expect(1);
    test.equal(analyze(script), 'SAFE');
    test.done();
  },
  'testLocalAssignment': function(test) {
	 var script = "function f() { var x=\"zap\"; alert(x); }";
    test.expect(1);
    test.equal(analyze(script), 'SAFE');
    test.done();
  }, 
  'testCircularAssignment': function(test) {
	 var script = "var x=\"zap\"; var y=x; x=y; alert(x);";
    test.expect(1);
    test.equal(analyze(script), 'SAFE');
    test.done();
  }, 
  'testAssignmentFromFunctionReturn': function(test) {
	 var script = "var x=g(1); alert(x);\n" + "function g(y) { return y }";
    test.expect(1);
    test.equal(analyze(script), 'SAFE');
    test.done();
  }, 
  'testFunctionFromAStructure': function(test) {
	 var script = "var functionContainer = {\n" + "  f : function() { return 100; }\n" + "}\n" +	"alert(functionContainer.f());";
    test.expect(1);
    test.equal(analyze(script), 'SAFE');
    test.done();
  },
  'testNestedFunctionCalls': function(test) {
	 var script = "alert(g(1));\n" + "function g(y) { return y }";
    test.expect(1);
    test.equal(analyze(script), 'SAFE');
    test.done();
  },
   'testRecursiveFunctionCalls': function(test) {
	 var script = "function f(x) { alert(x); f(x); }\n" + "f(1);";
    test.expect(1);
    test.equal(analyze(script), 'SAFE, RECURSIVE LOCAL "x"');
    test.done();
  },
  'testIndirectlyRecursiveFunctionCalls': function(test) {
	 var script = "function f(x) { alert(x); g(x); }\n" + "function g(y) { f(y); }\n" + "f(1);";
    test.expect(1);
    test.equal(analyze(script), 'SAFE, RECURSIVE LOCAL "x"');
    test.done();
  },
  'testArgumentValueFromFunctionParameter': function(test) {
	 var script = "g(1);\n" + "function g(y) { alert(y); }";
    test.expect(1);
    test.equal(analyze(script), 'SAFE');
    test.done();
  },
  'testArgumentPassingFromEnclosingFunction': function(test) {
	 var script = "function enclosing(x) { unknown(function() { alert(x); }); }\n" + "enclosing(123);";
    test.expect(1);
    test.equal(analyze(script), 'SAFE');
    test.done();
  },
  'testMultipleSafePossibleValues': function(test) {
	 var script = "function f() { var x=\"zap\"; x=\"foo\"; alert(x); }";
    test.expect(1);
    test.equal(analyze(script), 'SAFE');
    test.done();
  },
  'testMultipleDifferentPossibleValuesForUnresolvedFunction': function(test) {
	 var script = "var x=123; x=unknown1(); alert(unknown2(x))";
    test.expect(1);
    test.equal(analyze(script), 'UNRESOLVED(functionCall(global("unknown2"), tokens(SAFE()), 1)), UNRESOLVED(functionCall(global("unknown2"), tokens(UNRESOLVED(functionCall(global("unknown1"),tokens(), 1))), 1))');
    test.done();
  },
  'testMultipleArguments': function(test) {
	 var script = "alert(123, 456);";
    test.expect(1);
    test.equal(analyze(script), ['SAFE', 'SAFE']);
    test.done();
  },
  'testFunctionVariable': function(test) {
	 var script = "var f = alert; f(123);";
    test.expect(1);
    test.equal(analyze(script), 'SAFE');
    test.done();
  },
  'testCallback': function(test) {
	 var script = "function f(callback) { callback(123); } f(alert);";
    test.expect(1);
    test.equal(analyze(script, 'f'), 'UNRESOLVED(global("alert"))');
    test.equal(analyze(script, 'alert'), 'SAFE');
    test.done();
  },
  'testChainedCalls': function(test) {
	 var script = "function f() { return obj; } f().method(123);";
    test.expect(1);
    test.equal(analyze(script, 'f'), 'UNRESOLVED(global("alert"))');
    test.equal(analyze(script, 'alert'), 'SAFE');
    test.done();
  },
  'testChainedCalls': function(test) {
	 var script = "function f() { return obj; } f().method(123);";
    test.expect(1);
    test.equal(analyze(script, 'obj.method'), 'SAFE');
    test.done();
  },
  'testFunctionReturn': function(test) {
	 var script = "function f() { return alert; }\n" + "var g = f(); g(123);";
    test.expect(1);
    test.equal(analyze(script, 'g'), 'SAFE');
    test.done();
  }
}
