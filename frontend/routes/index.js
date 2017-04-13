var express = require('express');
var bcrypt = require('bcryptjs');
var request = require('request');

var router = express.Router();

var defaultSub = {
	Bio: 1,
	Math: 2,
	CS: 3,
	Chem: 4
}

router.get('/', function(req, res) {
	console.log("req.sessionID:", req.sessionID);
	console.log("req.session:", req.session);
	console.log("req.cookies:", req.cookies); // saved
	console.log("req.session.cookie:", req.session.cookie);
	console.log("req.session['username']:", req.session['username']);
	console.log("req.session['data']:", req.session['data']);

	if (req.session['data'] == null) {
		request.get({
    		url: 'http://localhost:3000',
    		json: true
		}, function(error, response, body) {
			res.render('initial', {nav: response.body.ALL_DOMAINS, subnav: response.body.ALL_SUBDOMAINS, subs: response.body.ALL_SUBDOMAINS, threads: response.body.ALL_THREADS, logged: response.body.logged});
		});
	}

	else if (req.session['data'] != null) {
		request.post({
    		url: 'http://localhost:3000',
    		json: true,
    		form: {username: req.session['data'].username}
		}, function(error, response, body) { // user_threads, user_subdomains_not_in initialized and retrieved
			res.render('initial', {nav: req.session['data'].user_domains, subnav: req.session['data'].user_subdomains, subs: response.body.user_subdomains_not_in, threads: response.body.user_threads, logged: response.body.logged});
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
    	url: 'http://localhost:3000/login',
    	form: {"username":"wz634", "password":"root"}
	}, function(error, response, body) {
		console.log(response.body);
		res.redirect("/");
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
		req.session["data"] = response.body; // user_domains and user_subdomains initialized and retrieved
		res.redirect("/");
	});
});

router.get('/logout', function(req, res) {
	delete req.session[req.session['username']];
	res.redirect('/');
});

module.exports = router;