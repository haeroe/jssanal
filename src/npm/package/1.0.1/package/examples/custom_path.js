/**
 * package - Easy package.json exports.
 * 
 * Author: Veselin Todorov <hi@vesln.com>
 * Licensed under the MIT License.
 */

/**
 * Dependencies.
 */

var package = require('../')(__dirname + '/..'); // parent dir.

console.log(package); // This will contain the package.json data.