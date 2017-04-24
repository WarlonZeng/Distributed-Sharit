var request = require('request');
var express = require('express');
var router = express.Router();

var api = 'http://api.distributed-sharit.warloncs.net';

var defaultSub = {
	All: 0,
	Bio: 1,
	Math: 2,
	CS: 3,
	Chem: 4
}

router.get('/', function(req, res) { // session: get user_domains, user_subdomains, index: user_subdomains_not_in, user_threads
	if (req.session.data == null) {
		request.get({
    		url: api,
    		json: true
		}, function(error, response, body) {
			// console.log("response.body:", response.body);
			res.render('index', {
				nav: response.body.ALL_DOMAINS, 
				subnav: response.body.ALL_SUBDOMAINS, 
				check_subdomains: response.body.ALL_SUBDOMAINS, 
				threads: response.body.ALL_THREADS, 
				logged: req.session.data.logged
			});
		});
	}

	else if (req.session.data != null) {
		request.post({
    		url: api,
    		json: true,
    		form: {username: req.session.data.username}
		}, function(error, response, body) { // user_threads, user_subdomains_not_in initialized and retrieved
			// console.log("response.body:", response.body);
			res.render('index', {
				nav: req.session.data.user_domains_in, 
				subnav: req.session.data.user_subdomains_in, 
				check_subdomains: response.body.user_subdomains_not_in, 
				threads: response.body.user_threads_in, 
				logged: req.session.data.logged
			});
		});
	}
});

router.get('/NYU', function(req, res) { // session: get user_domains, user_subdomains, index: user_subdomains_not_in, user_threads
	if (req.session.data == null) {
		request.get({
    		url: api,
    		json: true
		}, function(error, response, body) {
			// console.log("response.body:", response.body);
			res.render('index', {
				nav: response.body.ALL_DOMAINS, 
				subnav: response.body.ALL_SUBDOMAINS, 
				check_subdomains: response.body.ALL_SUBDOMAINS, 
				threads: response.body.ALL_THREADS, 
				logged: false
			});
		});
	}

	else if (req.session.data != null) {
		request.post({
    		url: api,
    		json: true,
    		form: {username: req.session.data.username}
		}, function(error, response, body) { // user_threads, user_subdomains_not_in initialized and retrieved
			// console.log("response.body:", response.body);
			res.render('index', {
				nav: req.session.data.user_domains_in, 
				subnav: req.session.data.user_subdomains_in, 
				check_subdomains: response.body.user_subdomains_not_in, 
				threads: response.body.user_threads_in, 
				logged: true
			});
		});
	}
});

router.get('/All', function(req, res) { // session: get user_domains, user_subdomains, index: user_subdomains_not_in, user_threads
	if (req.session.data == null) {
		request.get({
    		url: api + '/All',
    		json: true
		}, function(error, response, body) {
			// console.log("response.body:", response.body);
			res.render('index', {
				nav: response.body.ALL_DOMAINS, 
				subnav: response.body.ALL_SUBDOMAINS, 
				check_subdomains: response.body.ALL_SUBDOMAINS, 
				threads: response.body.ALL_THREADS, 
				logged: false
			});
		});
	}

	else if (req.session.data != null) {
		request.post({
    		url: api + '/All',
    		json: true,
    		form: {username: req.session.data.username}
		}, function(error, response, body) { // user_threads, user_subdomains_not_in initialized and retrieved
			// console.log("response.body:", response.body);
			res.render('index', {
				nav: req.session.data.user_domains_in, 
				subnav: req.session.data.user_subdomains_in, 
				check_subdomains: response.body.ALL_SUBDOMAINS, 
				threads: response.body.ALL_THREADS, 
				logged: true
			});
		});
	}
});

module.exports = router;