#!/usr/bin/env node

module.exports = function (grunt) {
"use strict";

// Project configuration.
grunt.initConfig({
	lint: {
		all: ['grunt.js', 'src/*.js']
	},
	test: {
		files: ['tests/*.js']
	}
	});

	// Default task.
	grunt.registerTask('default', 'lint', 'test');

	// Travis CI task.
	grunt.registerTask('travis', 'lint test');
};

