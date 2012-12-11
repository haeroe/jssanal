var tUtil      = require('./testUtils');
var Dependency = require('../src/dependency.js');

var doVersatile = true;
var groupTitle  = 'DEPENDENCY_TEST';

exports['DEPENDENCY_TEST'] = {
  
  setUp: function(done) {
	done();
  },

  'creating a dependency from a function declaration': function(test) {
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
	var list      = [];
	Dependency.fromBlock(paramBlock, undefined, list);
	list          = list[0];
	var condition = (list.type === 'function' && list.identifier === 'erkki'); 
	
    if (condition) { 
        tUtil.printTestOK(groupTitle, 
                          'creating a dependency from a function declaration', 
                          undefined, undefined, doVersatile);
    } 
    test.expect(1);
    test.ok(condition);
    test.done();
  },
  // test not valid anymore since the source has changed
  /*'creating a dependency from a binary expression': function(test) {
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
	var lista     = [];
	Dependency.fromBlock(paramBlock, undefined, lista);
	lista         = lista[0];
	var condition = (lista.type === 'binary' && lista.identifier === '*');

    if (condition) { 
        tUtil.printTestOK(groupTitle, 
                          'creating a dependency from a binary expression', 
                          undefined, undefined, doVersatile);
    }
    test.expect(1);
    test.ok(condition);
    test.done();
  }*/
}; 
