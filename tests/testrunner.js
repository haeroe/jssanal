var testrunner = require("qunit");

try {
  process.chdir(__dirname);
  console.log('New work directory: ' + process.cwd());
}
catch (err) {
  console.log('chdir: ' + err);
}

testrunner.setup({
  log: {
    assertions: true,
    errors: true,
    tests: true,
    //summary: true,
    globalSummary: true,
    testing: true
  },
  coverage: false,
  deps: null,
  namespace: null
});

testrunner.run({
    code : "../examples/main.js",
    tests : "./tests.js"
});
