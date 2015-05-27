/*jslint node: true */
'use strict';

// Declare variables 
var app, base_url, bodyParser, client, express, port, rtg, shortid;

// Declare values
express = require('express');
app = express();
port = process.env.PORT || 3000;
shortid = require('shortid');
bodyParser = require('body-parser');
base_url = process.env.BASE_URL || 'http://localhost:3000';

// Set up connection to Redis
if (process.env.REDISTOGO_URL) {
	rtg = require('url').parse(process.env.REDISTOGO_URL);
	client = require('redis').createClient(rtg.port, rtg.hostname);
	client.auth(rtg.auth.split(':')[1]);
} else {
	client = require('redis').createClient();
}

// Set up templating
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

// Set URL
app.set('base_url', base_url);

// Handle POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));

// Define index route
app.get('/', function (req, res) {
	res.render('index');
});

// Serve static files
app.use (express.static(__dirname + '/static'));

app.listen(port);

