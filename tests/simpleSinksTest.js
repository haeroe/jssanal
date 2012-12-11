var testUtils = require('./testUtils');

var doVersatile    = true;
var groupTestTitle = 'SIMPLE_SINK_TEST';

exports['SIMPLE_SINKS_TEST'] = {
  setUp: function(done) {
    done();
  },
  'testSinkCallLiteralParam': function(test) {
    var script    = "eval(1)";
    var results   = testUtils.analyze(script);
    var condition = results.safeSinkCalls.length !== 0;
    
    if (condition) { 
        testUtils.printTestOK(groupTestTitle, 
                              'testSinkCallLiteralParam', 
                              undefined, script, doVersatile);
    }
    test.expect(1);
    test.ok(condition, "test source:[ " + script + "]" );
    test.done();
  },
  'testSinkCallSafeConstant': function(test) {
    var script    = "var seppo = 5; eval(seppo);";
    var results   = testUtils.analyze(script);
    var condition = results.safeSinkCalls.length !== 0;
    
    if (condition) { 
        testUtils.printTestOK(groupTestTitle, 
                              'testSinkCallSafeConstant', 
                              undefined, script, doVersatile);
    }
    test.expect(1);
    test.ok(condition, "test source:[ " + script + "]" );
    test.done();
  },
  'testSinkCallUnsafeDynamicParameter': function(test) {
    var script    = "var seppo = outofscope; eval(seppo);";
    var results   = testUtils.analyze(script);
    var condition = results.unsafeSinkCalls.length !== 0;
    
    if (condition) { 
        testUtils.printTestOK(groupTestTitle, 
                              'testSinkCallUnsafeDynamicParameter', 
                              undefined, script, doVersatile);
    }
    test.expect(1);
    test.ok(condition, "test source:[ " + script + "]" );
    test.done();
  },
  'testSinkCallSafeFunctionReturnValue': function(test) {
    var script    = "function f() { return 'safe literal'; } eval(f());";
    var results   = testUtils.analyze(script);
    var condition = results.safeSinkCalls.length !== 0;
    
    if (condition) { 
        testUtils.printTestOK(groupTestTitle, 
                              'testSinkCallSafeFunctionReturnValue', 
                              undefined, script, doVersatile);
    }
    test.expect(1);
    test.ok(condition, "test source:[ " + script + "]" );
    test.done();
  },
  'testAssignmentSinkSafeValue': function(test) {
    var script    = "var localVar = 'also safe'; document.URL = localVar;";
    var results   = testUtils.analyze(script);
    var condition = results.safeAssignments.length !== 0;
    
    if (condition) { 
        testUtils.printTestOK(groupTestTitle, 
                              'testAssignmentSinkSafeValue', 
                              undefined, script, doVersatile);
    }
    test.expect(1);
    test.ok(condition, "test source:[ " + script + "]" );
    test.done();
  },
  'testAssignmentSourceVariableOutOfScope': function(test) {
    var script    = "document.URL = outofscope;"; // member variable source assignment 
    var results   = testUtils.analyze(script);
    //var condition = results.safeAssignments.length !== 0;
    var condition = results.unsafeAssignments.length !== 0;

    if (condition) {
        testUtils.printTestOK(groupTestTitle, 
                              'testAssignmentSinkVariableOutOfScope', 
                              undefined, script, doVersatile);
    }
    test.expect(1);
    test.ok(condition, "test source:[ " + script + "]" );
    test.done();
  },
  'testAssignmentSinkSafeValueFromFunctionReturn': function(test) {
    var script    = "function f() { return 'safe'; } document.write = f();";
    var results   = testUtils.analyze(script);
    //var condition = results.safeSinkCalls.length !== 0; 
    var condition = results.safeAssignments.length !== 0 &&
                    results.safeSinkCalls.length !== 0; 

    if (condition) {
        testUtils.printTestOK(groupTestTitle, 
                              'testAssignmentSinkSafeValueFromFunctionReturn', 
                              undefined, script, doVersatile);
    }
    test.expect(1);
    test.ok(condition, "test source:[ " + script + "]" );
    test.done();
  },
  'testSinkGiveRecursiveDefinition': function(test) {
    var script  = "function f() { return a(); } function a() { return f(); } eval( f() );";
    var results = testUtils.analyze(script);
    //var condition = results.safeSinkCalls.length !== 0;
    var condition = results.unsafeAssignments.length !== 0 && 
                    results.recursiveExpressions.length !== 0;

    if (condition) {
        testUtils.printTestOK(groupTestTitle, 
                              'testSinkGiveRecursiveDefinition', 
                              undefined, script, doVersatile);
    }
    test.expect(1);
    test.ok(condition, "test source:[ " + script + "]" );
    test.done();
  }
}

