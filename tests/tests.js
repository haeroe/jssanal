//var tr = require('qunit')

test("Hello World", function() {
    ok(true);
});

test("a basic test example", function (assert) {
    ok(true, "this test is fine");
    var value = "hello";
    equal("hello", value, "We expect value to be hello");
});
