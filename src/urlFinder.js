/* vim: set sw=4 ts=4 et tw=80 : */

var url   = require('url');
var http  = require('http');
var https = require('https');
var util  = require('util');

var jsurl     = '';
var isFindAll = false;

// parse comman line arguments
// used:
// node urlFinder.js url http://www.cs.helsinki.fi/u/kkaaria/oma.js
// node urlFinder url http://www.cs.helsinki.fi/u/kkaaria/*.js
process.argv.forEach(function(val, index) {

	if (val === 'url') {
		jsurl = process.argv[index + 1];
		return;
	}
});

function UrlFile(jsurl) {
    'use strict';

	this.doFindAll = false;
	this.uri = jsurl;

	if (jsurl === '') { return; } 

	var re = /\*.js$/;

	if (jsurl.match(re) !== null && jsurl.match(re)[0] === '*.js') {
        this.doFindAll = true;
        this.uri = jsurl.substring(0, jsurl.search(re));
	}       
	this.options = url.parse(this.uri);
}

UrlFile.prototype.wget = function(callback) {
   
    var doFindAll = this.doFindAll,
        options = this.options;

    var request, response_body = '';

    if (options.protocol === 'https:') {
		request = https.get(this.uri);
    } else {
        request = http.get(this.uri);
    }

    request.end();
    request.on('response', function(response) {
    response.on('data', function(chunk) {
		
			if (doFindAll === true) {
			
				var hrefRE = /\ *href=.([\/a-zA-Z_]*.js)/;
				var chunks = chunk.toString().split("<a ");

				response_body = []; 
				
				chunks.forEach(function(chunky) {
					
					var path = hrefRE.exec(chunky);

					if (path !== null && path[1] !== null) {
						var nurl = options.protocol + (options.slashes ? '//' : '') + options.hostname + options.pathname + path[1];
						response_body.push(nurl);
					}
				});            
			} else {
				response_body += chunk;
			}	
        });
        response.on('end', function() {
            if (response_body instanceof Array) {
                response_body.forEach(function(rb) { 
                    var urlFile = new UrlFile(rb);
                    urlFile.wget(function(cb) {
                        callback(cb);
                    });
                });
            } else {
                callback(response_body);
            }    
		});
	});
};

var uf = new UrlFile(jsurl);
console.log('Url: ' + uf.uri + ' DoFindAll: ' + uf.doFindAll); 
console.log('Options: ' + util.inspect(uf.options));

// get file(s) contents through callback
uf.wget(function(callback) {
	console.log('\n' + callback);
});


module.exports = UrlFile;
