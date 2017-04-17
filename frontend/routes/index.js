var request = require('request');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

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
				join_subs: response.body.ALL_SUBDOMAINS, 
				threads: response.body.ALL_THREADS, 
				logged: false});
		});
	}

	if (req.session.data != null) {
		request.post({
    		url: 'http://localhost:3000',
    		json: true,
    		form: {username: req.session.data.username}
		}, function(error, response, body) { // user_threads, user_subdomains_not_in initialized and retrieved
			// console.log("response.body:", response.body);
			res.render('index', {
				nav: req.session.data.user_domains_in, 
				subnav: req.session.data.user_subdomains_in, 
				join_subs: response.body.user_subdomains_not_in, 
				threads: response.body.user_threads_in, 
				logged: true});
		});
	}
});

router.get('/auth', function(req, res) {
	res.render('auth');
});

router.get('/register', function(req, res) {
	res.render('register');
});

router.post('/register', function(req, res) {
	request.post({
    	url: 'http://localhost:3000/register',
    	form: {
    		username: req.body.username, 
    		password: req.body.password
    	}
	}, function(error, response, body) {
		console.log(response.body);
		res.redirect("/login");
	});
});

router.get('/login', function(req, res){
	res.render('login');
});

router.post('/login', function(req, res) {
	request.post({
    	url: 'http://localhost:3000/login',
    	json: true,
    	form: {
    		"username": req.body.username, 
    		"password": req.body.password}
	}, function(error, response, body) {
		req.session.data = response.body; // user_domains and user_subdomains initialized and retrieved
		res.redirect("/");
	});
});

router.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		res.redirect('/');
	})
});

module.exports = router;