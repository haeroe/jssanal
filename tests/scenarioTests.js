var analyze = require('./testUtils');

exports['ScenarioTest'] = {

    setUp: function(done) {
        console.log("\nScenarioTest setUp!");
        done();
    },
    tearDown: function (done) {
        console.log("\nScenarioTest tearDown!");
        done();    
    },

    'simpleFunctionTest': function(test) {
        var script  = "function getTitleText(){return \"Hello!\";}";
        var results = analyze.analyze(script);
        test.expect(1);
        test.ok(false, "the results TOBE validated");
        test.done();
    },
    'simpleSafeScenarioTest': function(test) {
        var script  = "function getTitleText(){return \"Hello!\";} $(\"div.header\").append(\"<h1>\" + getTitleText() + \"</h1>\");";
        var results = analyze.analyze(script);
        //TODO: check that the results do not contain 
        test.expect(1);
        test.equal(results.safe, true, "the getTitleText() function call should be safe");    
        test.done();
    },
    'simpleUnSafeScenarioTest': function(test) {
        var script = "function getTitleText(){return \"Hello\" + user.name + \"!\";} $(\"div.header\").append(\"<h1>\" + getTitleText() + \"</h1>\");";
        var results = analyze.analyze(script);
        //TODO: check that the results do contain
        test.expect(1);
        test.equal(results.safe, false, "the getTitleText() function call should be UNsafe");    
        test.done();
    },
    'simpleEscapedScenarioTest': function(test) {
        var script = "function getTitleText(){return \"Hello\" + user.name + \"!\";} $(\"div.header\").append(\"<h1>\" + htmlEscape(getTitleText()) + \"</h1>\");";
        var results = analyze.analyze(script);
        //TODO: check that the results do not contain
        test.expect(1);
        test.equal(results.safe, true, "the getTitleText() function call is unsafe, but escaped and therefore should be safe");    
        test.done();
    }

    //TODO: more complex scenario tests
}
