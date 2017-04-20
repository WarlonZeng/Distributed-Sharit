var request = require('request');
var express = require('express');
var router = express.Router();

var defaultSub = {
	All: 0,
	Bio: 1,
	Math: 2,
	CS: 3,
	Chem: 4
}

router.get('/', function(req, res) { // session: get user_domains, user_subdomains, index: user_subdomains_not_in, user_threads
	console.log("req.session.data:", req.session.data);

	if (req.session.data == null) {
		request.get({
    		url: 'http://localhost:3000',
    		json: true
		}, function(error, response, body) {
			// console.log("response.body:", response.body);
			res.render('index', {
				nav: response.body.ALL_DOMAINS, 
				subnav: response.body.ALL_SUBDOMAINS, 
				check_subdomains: response.body.ALL_SUBDOMAINS, 
				threads: response.body.ALL_THREADS, 
				logged: false});
		});
	}

	else if (req.session.data != null) {
		request.post({
    		url: 'http://localhost:3000',
    		json: true,
    		form: {username: req.session.data.username}
		}, function(error, response, body) { // user_threads, user_subdomains_not_in initialized and retrieved
			// console.log("response.body:", response.body);
			res.render('index', {
				nav: req.session.data.user_domains_in, 
				subnav: req.session.data.user_subdomains_in, 
				check_subdomains: response.body.user_subdomains_not_in, 
				threads: response.body.user_threads_in, 
				logged: true});
		});
	}
});

router.get('/NYU', function(req, res) { // session: get user_domains, user_subdomains, index: user_subdomains_not_in, user_threads
	console.log("req.session.data:", req.session.data);

	if (req.session.data == null) {
		request.get({
    		url: 'http://localhost:3000',
    		json: true
		}, function(error, response, body) {
			// console.log("response.body:", response.body);
			res.render('index', {
				nav: response.body.ALL_DOMAINS, 
				subnav: response.body.ALL_SUBDOMAINS, 
				check_subdomains: response.body.ALL_SUBDOMAINS, 
				threads: response.body.ALL_THREADS, 
				logged: false});
		});
	}

	else if (req.session.data != null) {
		request.post({
    		url: 'http://localhost:3000',
    		json: true,
    		form: {username: req.session.data.username}
		}, function(error, response, body) { // user_threads, user_subdomains_not_in initialized and retrieved
			// console.log("response.body:", response.body);
			res.render('index', {
				nav: req.session.data.user_domains_in, 
				subnav: req.session.data.user_subdomains_in, 
				check_subdomains: response.body.user_subdomains_not_in, 
				threads: response.body.user_threads_in, 
				logged: true});
		});
	}
});

module.exports = router;