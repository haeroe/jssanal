var Dependency = require('../src/dependency.js');

exports['dependencyTest'] = {
  setUp: function(done) {
	done();
  },
  'creating a dependency from a function declaration': function(test) {
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
  },
  'creating a dependency from a binary expression': function(test) {
    test.expect(1);
    var paramBlock = {
                        "type": "BinaryExpression",
                        "operator": "*",
                        "left": {
                            "type": "Literal",
                            "value": 6,
                            "raw": "6"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 7,
                            "raw": "7"
                        }
                     };
	var lista = [];
	Dependency.fromBlock(paramBlock, undefined, lista);
	lista = lista[0];
	var result = (lista.type === 'binary' && lista.identifier === '*'); 
	test.ok(result);
    test.done();
  }
} 
