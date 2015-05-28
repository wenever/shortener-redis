/*jslint node: true */
'use strict';

// Declare variables 
var app, base_url, bodyParser, client, express, port, rtg, shortid;

// Declare values
express = require('express');
app = express();
port = process.env.PORT || 5000;
shortid = require('shortid');
bodyParser = require('body-parser');
base_url = process.env.BASE_URL || 'http://localhost:5000';

/* set up connection to redis */
/* istanbul ignore if */
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

// Define submit route
app.post('/', function (req, res) {
    // Declare variables
    var url, id;

    // Get URL
    url = req.body.url;

    // Create a hashed short version
    id = shortid.generate();

    // Store them in Redis
    client.set(id, url, function () {
        // Display the response
        res.render('output', { id: id, base_url: base_url });
    });
});

// define link route
app.route('/:id').all(function (req, res) {
	// get id
	var id = req.params.id.trim();

	//look up the url
	client.get(id, function (err, reply) {
		if (!err && reply) {
			 //redirect user to it
			 res.status(301);
			 res.set('Location', reply);
			 res.send();
		} else {
			//confirm no such link in database
				res.status(404);
				res.render('error');
		}
	});
});

// Serve static files
app.use (express.static(__dirname + '/static'));

app.listen(port);

