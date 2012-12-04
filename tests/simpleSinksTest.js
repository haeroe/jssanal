var testUtils = require('./testUtils');
var doVersatile = true;

exports['simpleSinksTest'] = {
  setUp: function(done) {
    done();
  },
  'testSinkCallLiteralParam': function(test) {
    var script    = "eval(1)";
    var results   = testUtils.analyze(script);
    var condition = results.safeSinkCalls.length !== 0;
    
    if (condition) { 
        //console.log('\n testSinkCallLiteralParam'); 
        testUtils.printTestOK('testSinkCallLiteralParam', undefined, script, doVersatile);
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
        //console.log('\n testSinkCallSafeConstant'); 
        testUtils.printTestOK('testSinkCallSafeConstant', undefined, script, doVersatile);
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
        testUtils.printTestOK('testSinkCallUnsafeDynamicParameter', script, doVersatile);
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
        testUtils.printTestOK('testSinkCallSafeFunctionReturnValue', undefined, script, doVersatile);
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
        testUtils.printTestOK('testAssignmentSinkSafeValue', undefined, script, doVersatile);
    }
    test.expect(1);
    test.ok(condition, "test source:[ " + script + "]" );
    test.done();
  },
  'testAssignmentSinkVariableOutOfScope': function(test) {
    var script    = "document.URL = outofscope;";
    var results   = testUtils.analyze(script);
    var condition = results.safeAssignments.length !== 0;
    
    if (condition) {
        testUtils.printTestOK('testAssignmentSinkVariableOutOfScope', undefined, script, doVersatile);
    }
    test.expect(1);
    test.ok(condition, "test source:[ " + script + "]" );
    test.done();
  },
  'testAssignmentSinkSafeValueFromFunctionReturn': function(test) {
    var script    = "function f() { return 'safe'; } document.write = f();";
    var results   = testUtils.analyze(script);
    //var condition = results.safeSinkCalls.length !== 0;
    var condition = results.safeAssignments.length !== 0;    

    if (condition) {
        testUtils.printTestOK('testAssignmentSinkSafeValueFromFunctionReturn', undefined, script, doVersatile);
    }
    test.expect(1);
    test.ok(condition, "test source:[ " + script + "]" );
    test.done();
  },
  'testSinkGiveRecursiveDefinition': function(test) {
    var script  = "function f() { return a(); } function a() { return f(); } eval( f() );";
    var results = testUtils.analyze(script);
    //var condition = results.safeSinkCalls.length !== 0;
    var condition = results.unsafeAssignments.length !== 0;

    if (condition) {
        testUtils.printTestOK('testSinkGiveRecursiveDefinition', undefined, script, doVersatile);
    }
    test.expect(1);
    test.ok(condition, "test source:[ " + script + "]" );
    test.done();
  }
}

