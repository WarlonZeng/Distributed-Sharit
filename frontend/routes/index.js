var express = require('express');
var bcrypt = require('bcryptjs');
var request = require('request');
var router = express.Router();

var defaultSub = {
	All: 0,
	Bio: 1,
	Math: 2,
	CS: 3,
	Chem: 4
}

router.get('/', function(req, res) { // session: get user_domains, user_subdomains, index: user_subdomains_not_in, user_threads
	console.log("req.sessionID:", req.sessionID);
	console.log("req.session:", req.session);
	console.log("req.cookies:", req.cookies); // saved
	console.log("req.session.cookie:", req.session.cookie);
	console.log("req.session['username']:", req.session['username']);
	console.log("req.session['data']:", req.session['data']);

	if (req.session['data'] == null) {

		var logged = false;
		request.get({
    		url: 'http://localhost:3000',
    		json: true
		}, function(error, response, body) {
			console.log("response.body:", response.body);
			res.render('index', {nav: response.body.ALL_DOMAINS, subnav: response.body.ALL_SUBDOMAINS, subs: response.body.ALL_SUBDOMAINS, threads: response.body.ALL_THREADS, logged: logged});
		});
	}

	else if (req.session['data'] != null) {
		var logged = true;
		request.post({
    		url: 'http://localhost:3000',
    		json: true,
    		form: {username: req.session['data'].username}
		}, function(error, response, body) { // user_threads, user_subdomains_not_in initialized and retrieved
			res.render('index', {nav: req.session['data'].user_domains, subnav: req.session['data'].user_subdomains, subs: response.body.user_subdomains_not_in, threads: response.body.user_threads, logged: logged});
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
    	form: {username: req.body.username, 
    		password: req.body.password,
    		first_name: req.body.first_name,
    		last_name: req.body.last_name
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
    	form: {"username": req.body.username, "password": req.body.password}
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