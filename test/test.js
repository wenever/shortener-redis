/*jslint node: true */
/*global describe: false, before: false, after: false, it: false */
"use strict";

// Declare the variables used
var expect = require('chai').expect,
		request = require('request'),
		server = require('../index'),
		redis = require('redis'),
		client;
client = redis.createClient();

//server tasks
describe('server', function() {

	// Beforehand, start the server
	before(function (done) {
			console.log('Starting the server');
			done();
	});

	// Afterwards, stop the server and empty the database
	after(function (done) {
			console.log('Stopping the server');
			client.flushdb();
			done();
	});

	// Test the index route
	describe('Test the index route', function () {
		it('should return a page with the title Shortbread', function (done) {
			  request.get({ url: 'http://localhost:3000'}, function (error, response, body) {
			  		expect(body).to.include('Shortbread');
			  		expect(response.statusCode).to.equal(200);
			  		expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
			  		done();
			  });
		});
	});

	// Test submitting a URL
	describe('Test submitting a URL', function() {
		it ('should return the shortened URL', function (done) {
				request.post('http://localhost:3000', {form: {url: 'http://www.google.com'}}, function (error, response, body) {
						expect(body).to.include('Your shortened URL is');
						expect(response.statusCode).to.equal(200);
						expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
						done();
				});
		});
	});
});