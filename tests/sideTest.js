var tUtil = require('./testUtils');

var doVersatile    = true;
var groupTestTitle = 'SIDE_TEST';

// Tests to be added 
exports['SIDE_TEST'] = {

    setUp: function(callback) {
        callback();
    },
    tearDown: function (callback) {
        callback();    
    },

    'MemberFunctionSinkAssignmentOfUnInitializedVariable': function(test) {
        var script = "var a; $('#myDiv').html(a);";
        var results = tUtil.analyze(script);

        var testOk = (results.safeSinkCalls.length === 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length === 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle, 
                              'MemberFunctionSinkAssignmentOfUnInitializedVariable', 
                              undefined, script, doVersatile);
        }

        test.expect(1);
        test.ok(testOk, "message: 'parse crash'    test source:[" + script + "]");
        test.done();
    }/*,
    ' ': function(test) {
        var script = ' ';
        var results = tUtil.analyze(script);

        var testOk = (results.safeSinkCalls.length === 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length === 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle, 
                              ' ', 
                              undefined, script, doVersatile);
        }

        test.expect(1);
        test.ok(testOk, "message: 'parse crash'    test source:[" + script + "]");
        test.done();
    },
    'Array Initializer': function(test) {
        var script = 'x = []; x = [ 42 ]; x = [ ,, 42 ]; x = [ 1, 2, 3, ];';
        var results = tUtil.analyze(script);

        var testOk = (results.safeSinkCalls.length === 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length === 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle, 'Array Initializer', 
                              undefined, script, doVersatile);
        }

        test.expect(1);
        test.ok(testOk, "message: 'parse crash'    test source:[" + script + "]");
        test.done();
    },
    'Object Initializer': function(test) {
        var script = 'x = {}; x = { answer: 42 }; x = { if: 42 }; x = { true: 42 }; x = { null: 42 };\n'; 
            script += 'x = { "answer": 42 }; x = { x: 1, x: 2 }; \n';
            script += 'x = { get width() { return m_width } }; x = { get undef() {} }; x = { get if() {} }\n';
            script += 'x = { get null() {} };\n x = { get 10() {} };\n x = { set width(w) { m_width = w } };\n';
            script += 'x = { set if(w) { m_if = w } };\n x = { set "null"(w) { m_null = w } };\n x = { set: 43 };'; 
        var results = tUtil.analyze(script);

        var testOk = (results.safeSinkCalls.length === 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length === 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle, 'Object Initializer', 
                              undefined, script, doVersatile);
        }

        test.expect(1);
        test.ok(testOk, "message: 'parse crash'    test source:[" + script + "]");
        test.done();
    },
    'Left-Hand-Side Expression': function(test) {
        var script = 'new Button(); new new foo; new foo().bar(); new foo[bar]; (    foo  )();\n';
            script += 'universe.milkyway.solarsystem; universe[42].galaxies; universe(42).galaxies(14, 3, 77).milkyway; \n';
            script += 'universe.null; ';
        var results = tUtil.analyze(script);

        var testOk = (results.safeSinkCalls.length === 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length === 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle, 'Left-Hand-Side Expression', 
                              undefined, script, doVersatile);
        }

        test.expect(1);
        test.ok(testOk, "message: 'parse crash'    test source:[" + script + "]");
        test.done();
    },
    ' ': function(test) {
        var script = '  ';
        var results = tUtil.analyze(script);

        var testOk = (results.safeSinkCalls.length === 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length === 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle, '  ', 
                              undefined, script, doVersatile);
        }

        test.expect(1);
        test.ok(testOk, "message: 'parse crash'    test source:[" + script + "]");
        test.done();
    },*/
};