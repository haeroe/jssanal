var tUtil = require('./testUtils');

var doVersatile      = true;
var GROUP_TEST_TITLE = 'SCENARIO2_TEST';

// More scenarios, including UAT

exports['SCENARIO2_TEST'] = {

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
                     (results.unsafeSinkCalls.length !== 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            tUtil.printTestOK(GROUP_TEST_TITLE, 
                              'MemberFunctionSinkAssignmentOfUnInitializedVariable', 
                              undefined, script, doVersatile);
        }

        test.expect(1);
        test.ok(testOk, "message: 'parse crash'    test source:[" + script + "]");
        test.done();
    },
    'TwoUnsafeAndTwoSafeEvalCallsCalledInTestFunction': function(test) {
        var script = 'function myfunction1(txt1){ eval(txt1); } \n' +
                     'function myfunction2(txt2){ eval(txt2); } \n' +
                     'function myfunction3(txt3){ eval(txt3); } \n' +
                     'function myfunction4(txt4){ eval(txt4); } \n' +
                     'function test() { \n' +
                     '   myfunction1("123"); \n' +
                     '   var x = "456"; \n' +
                     '   myfunction2(x); \n' + 
                     '   var y = getUserInput(x); \n' +
                     '   myfunction3(y); \n' +
                     '   var z = document.url; \n' +
                     '   myfunction4(z); \n' +
                     '}';
        var results = tUtil.analyze(script);

        var testOk = (results.safeSinkCalls.length !== 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length !== 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            tUtil.printTestOK(GROUP_TEST_TITLE,  
                              'TwoUnsafeAndTwoSafeEvalCallsCalledInTestFunction',
                              undefined, script, doVersatile);
        }

        test.expect(1);
        test.ok(testOk, "message: 'parse crash'    test source:[" + script + "]");
        test.done();
    },
    'TwoUnsafeAndTwoSafeEvalCallsCalledInTestFunctionWithTestCall': function(test) {
        var script = 'function myfunction1(txt1){ eval(txt1); } \n' +
                     'function myfunction2(txt2){ eval(txt2); } \n' +
                     'function myfunction3(txt3){ eval(txt3); } \n' +
                     'function myfunction4(txt4){ eval(txt4); } \n' +
                     'function test() { \n' +
                     '   myfunction1("123"); \n' +
                     '   var x = "456"; \n' +
                     '   myfunction2(x); \n' + 
                     '   var y = getUserInput(x); \n' +
                     '   myfunction3(y); \n' +
                     '   var z = document.url; \n' +
                     '   myfunction4(z); \n' +
                     '};\n' +
                     'test();' // test call

        var results = tUtil.analyze(script);

        var testOk = (results.safeSinkCalls.length !== 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length !== 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle, 
                              'TwoUnsafeAndTwoSafeEvalCallsCalledInTestFunctionWithTestCall',
                              undefined, script, doVersatile);
        }

        test.expect(1);
        test.ok(testOk, "message: 'parse crash'    test source:[" + script + "]");
        test.done();
    },
    'ThreeSafeAndOneRecursiveAndOneUnSafeEvalCalls': function(test) {
        var script = 'function a(){ var c = b(); return c; }\n' +
                     'function b(){ return a(); }\n' +
                     'function c(){ return " ";}\n' +
                     'var constant = 1;\n' + 
                     'eval(constant); eval(document); //unknown varible \n' +
                     'eval(a()); //recursive definition \n' +
                     'eval(c()); eval("literal");';

        var results = tUtil.analyze(script);

        var testOk = (results.safeSinkCalls.length !== 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length !== 0) &&
                     (results.recursiveExpressions.length === 0) && // ?
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle,
                              'ThreeSafeAndOneRecursiveAndOneUnSafeEvalCalls',
                              undefined, script, doVersatile);
        }

        test.expect(1);
        test.ok(testOk, "message: 'parse crash'    test source:[" + script + "]");
        test.done();
    },
    'BasicUAT': function(test) {
        var script = 'UAT_1(); \n' + 
                    'function UAT_1() { \n' +
                    '   var unsafeFromURL1 = document.URL;\n' +
                    '   document.write(unsafeFromURL1);\n' +
                    '}\n' +
                    'UAT_2();\n' +
                    'function UAT_2() { \n' +
                    'var unsafeFromServer2 = serverDelegate.rpc();\n' +
                    'eval(unsafeFromServer2);\n' +       
                    '}\n' +
                    'UAT_3();\n' +
                    'function UAT_3() { \n' +
                    '   var unsafeFromURL3 = document.URL;\n' +
                    '   $("#mydiv").innerHTML = "<b>" + unsafeFromURL3 + "</u>";\n' +
                    '}';

        var results = tUtil.analyze(script);

        var testOk = (results.safeSinkCalls.length === 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length !== 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length !== 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle, 
                              'BasicUAT',
                              undefined, script, doVersatile);
        }

        test.expect(1);
        test.ok(testOk, "message: 'parse crash'    test source:[" + script + "]");
        test.done();
    },
    'MultiplyComplexFunctionCallsinMultiplyFunctions': function(test) {
        var script = 'function func1(){ \n' +
                    '    func1(); \n' +       
                    '    func2("zoo");\n'+   
                    '    func3(func2);\n'+   
                    '    var x = func6();\n'+
                    '    x("sdds");\n'+
                    '}\n'+
                    'function func2(text, second, third){\n'+
                    '    external.function1(text);\n'+
                    '}\n'+
                    'function func3(fnRef){\n'+
                    '    fnRef("boo");\n'+
                    '}\n'+
                    'function func4(){\n'+
                    '    func3(function(text) { external.function2(text); });\n'+
                    '    func3(func5());\n'+ 
                    '}\n'+
                    'function func5(){\n'+
                    '    return function(foo) { external.function3(foo); };\n'+      
                    '}\n'+
                    'function func6(){\n'+
                    '    return func2;\n'+
                    '}\n';

        var results = tUtil.analyze(script);

        var testOk = (results.safeSinkCalls.length !== 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length !== 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle,
                              'MultiplyComplexFunctionCallsinMultiplyFunctions',
                              undefined, script, doVersatile);
        }

        test.expect(1);
        test.ok(testOk, "message: 'parse crash'    test source:[" + script + "]");
        test.done();
    }/*,
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
            tUtil.printTestOK(groupTestTitle, 
                              'Test to be added', 
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
    },*/
};
