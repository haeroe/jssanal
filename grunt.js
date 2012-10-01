#!/usr/bin/env node

module.exports = function (grunt) {
"use strict";

// Project configuration.
grunt.initConfig({
	lint: {
		all: ["grunt.js", "src/*.js", "tests/*.js"]
	},
	jshint: {
		options: {
			browser: true,
			curly: true,
			eqeqeq: true,
			newcap: true,
			undef: true,
			eqnull: true,
			node: true
		},
		globals: {
			exports: true,
			Ext: false,
			console: false,
			alert: false,
			prompt: false
		}
	},
	qunit: {
		index: ['tests/tests.js']
		}
	});

	// Default task.
	grunt.registerTask('default', 'lint', 'qunit');

	// Travis CI task.
	grunt.registerTask('travis', 'lint qunit');
};

