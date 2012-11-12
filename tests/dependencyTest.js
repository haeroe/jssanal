var Dependency = require('../src/dependency.js');



exports['dependency'] = {
  setUp: function(done) {
	done();
  },
  'creating a dependency from a parameter': function(test) {
    test.expect(1);
    var paramBlock = {
            "type": "FunctionDeclaration",
            "id": {
                "type": "Identifier",
                "name": "erkki",
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 9
                    },
                    "end": {
                        "line": 1,
                        "column": 14
                    }
                }
            },
            "params": [],
            "defaults": [],
            "body": {
                "type": "BlockStatement",
                "body": [],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 17
                    },
                    "end": {
                        "line": 4,
                        "column": 1
                    }
                }
            }
        }; 
	var list = [];
	Dependency.fromBlock(paramBlock, undefined, list);
	list = list[0];
	var result = (list.type === 'function' && list.identifier === 'erkki'); 
	test.ok(result);
    test.done();
  }
}
