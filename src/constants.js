// Esprima constants
// copied from github escodegen

SYNTAX = {
// General
	//Glob:		'Glob'
	//Path:		'Path',
	Program:    'Program',
    Property:   'Property',
	Identifier:	'Identifier',
	Literal:    'Literal',
// Expressions
	AssignmentExpression: 	'AssignmentExpression',
   	ArrayExpression: 		'ArrayExpression',
 	BinaryExpression: 		'BinaryExpression',
  	CallExpression: 		'CallExpression',
  	ComprehensionExpression:'ComprehensionExpression',
 	ConditionalExpression:	'ConditionalExpression',
 	FunctionExpression: 	'FunctionExpression',
 	LogicalExpression: 		'LogicalExpression',
 	MemberExpression: 		'MemberExpression',
 	NewExpression: 			'NewExpression',
 	ObjectExpression: 		'ObjectExpression',
    SequenceExpression: 	'SequenceExpression',
    ThisExpression: 		'ThisExpression',
    UnaryExpression: 		'UnaryExpression',
    UpdateExpression: 		'UpdateExpression',
    YieldExpression: 		'YieldExpression',
// Declaration
	FunctionDeclaration: 'FunctionDeclaration',
	VariableDeclaration: 'VariableDeclaration',
    VariableDeclarator:  'VariableDeclarator',

	CatchClause:       	 'CatchClause',
	ComprehensionBlock:	 'ComprehensionBlock',
	SwitchCase:       	 'SwitchCase',
// Statements	
	BlockStatement:      'BlockStatement',
	BreakStatement:      'BreakStatement',
	ContinueStatement:   'ContinueStatement',
    DirectiveStatement:  'DirectiveStatement',
    DoWhileStatement:    'DoWhileStatement',
    DebuggerStatement:   'DebuggerStatement',
    EmptyStatement:      'EmptyStatement',
    ExpressionStatement: 'ExpressionStatement',
    ForStatement:        'ForStatement',
    ForInStatement:      'ForInStatement',
	IfStatement:         'IfStatement',
    LabeledStatement:    'LabeledStatement',
	ReturnStatement:     'ReturnStatement',
    SwitchStatement:     'SwitchStatement',
	ThrowStatement:      'ThrowStatement',
    TryStatement:        'TryStatement',
	WhileStatement:      'WhileStatement',
    WithStatement:       'WithStatement',
// Patterns
	ArrayPattern:        'ArrayPattern',
	ObjectPattern:       'ObjectPattern',
};

// SYNTAX KEYS
VISITORKEYS = {
    // Statements
    BlockStatement:       ['body'],
    BreakStatement:       ['label'],                       
    ContinueStatement:    ['label'],
    CatchClause:          ['param', 'body'],                                                                                                                              
    DirectiveStatement:   [],                                                                                                                                     
    DoWhileStatement:     ['body', 'test'],                                                                                                                       
    DebuggerStatement:    [],                                                                                                                                     
    EmptyStatement:       [],                                                                                                                                     
    ExpressionStatement:  ['expression'],                                                                                                                         
    ForStatement:         ['init', 'test', 'update', 'body'],                                                                                                     
    ForInStatement:       ['left', 'right', 'body'],    
    IfStatement:          ['test', 'consequent', 'alternate'],
    LabeledStatement:     ['label', 'body'],
    ReturnStatement:      ['argument'],
    SwitchCase:           ['test', 'consequent'],
    SwitchStatement:      ['discriminant', 'cases'],
    ThrowStatement:       ['argument'],
    TryStatement:         ['block', 'handlers', 'finalizer'],
    WhileStatement:       ['test', 'body'],
    WithStatement:        ['object', 'body'],
    // Expressions
    AssignmentExpression: ['left', 'right'],
    ArrayExpression:      ['elements'],
    BinaryExpression:     ['left', 'right'],
    CallExpression:       ['callee', 'arguments'],
    ConditionalExpression: ['test', 'consequent', 'alternate'],
    FunctionExpression:   ['id', 'params', 'body'],
    LogicalExpression:    ['left', 'right'],
    MemberExpression:     ['object', 'property'],
    NewExpression:        ['callee', 'arguments'],
    ObjectExpression:     ['properties'],
    SequenceExpression:   ['expressions'],
    ThisExpression:       [],
    UnaryExpression:      ['argument'],
    UpdateExpression:     ['argument'],
    YieldExpression:      ['argument'],
    // Declarations
    FunctionDeclaration:  ['id', 'params', 'body'],
    VariableDeclaration:  ['declarations'],
    VariableDeclarator:   ['id', 'init'],
    // Other
    ArrayPattern:         ['elements'],
    Identifier:           [],
    Literal:              [],
    ObjectPattern:        ['properties'],
    Program:              ['body'],
    Property:             ['key', 'value'],
};

module.exports = {
    Syntax: SYNTAX,
    SyntaxKeys: VISITORKEYS
};
