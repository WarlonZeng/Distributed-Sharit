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
	request.get({
    	url: 'http://localhost:3000',
    	json: true
	}, function(error, response, body) {
		console.log("req.sessionID", req.sessionID);
		// console.log("req.session.id", req.sesssion.id);
		console.log("req.session", req.session);
		console.log("req.cookies", req.cookies); // saved
		console.log("req.session.cookie", req.session.cookie);


		if (!req.session['data']) {
			res.render('initial', {nav: response.body.ALL_DOMAINS, subnav: response.body.ALL_SUBDOMAINS, threads: response.body.ALL_THREADS, subs: response.body.ALL_SUBDOMAINS, logged: response.body.logged});
		}

		else if (req.session['data']) {
			// res.render('initial', {nav: req.session[username].nav, subnav: req.session[username].subnav, threads: threads, subs: subsUserNotIn, logged: true});
			// res.render('initial', {nav: response.body.ALL_DOMAINS, subnav: response.body.ALL_SUBDOMAINS, threads: response.body.ALL_THREADS, subs: response.body.ALL_DOMAINS, logged: repsonse.body.logged});
			res.json(response.body);
		}
	});
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
		// req.session[req.body.username] = {nav: response.body[response.body.username].nav, subnav: response.body[response.body.username].subnav};

		req.session["data"] = response.body;
		console.log(response.body);

		res.redirect("/");
	});
});

router.get('/logout', function(req, res) {
	delete req.session[req.session['username']];
	res.redirect('/');
});

module.exports = router;