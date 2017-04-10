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

/* GET home page. */
router.get('/', function(req, res) {

	request.get({
    	url: 'http://localhost:3000',
    	json: true
	}, function(error, response, body) {

		var username;
		//console.log(req.session['username']);
		console.log(req.session);

		console.log(response.body);
		
		if (req.session['username'] == null) { // GUEST
			res.render('initial', {nav: response.body.ALL_DOMAINS, subnav: response.body.ALL_SUBDOMAINS, threads: response.body.ALL_THREADS, subs: response.body.ALL_SUBDOMAINS, logged: response.body.logged});
		}

		if (req.session['username'] != null) {
			username = req.session['username'];

			console.log(username);
			console.log(req.session)

			res.render('initial', {nav: req.session[username].nav, subnav: req.session[username].subnav, threads: threads, subs: subsUserNotIn, logged: true});
			// res.render('initial', {nav: response.body.ALL_DOMAINS, subnav: response.body.ALL_SUBDOMAINS, threads: response.body.ALL_THREADS, subs: response.body.ALL_DOMAINS, logged: repsonse.body.logged});
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
    	form: {"username":"wz634", "password":"root"}
	}, function(error, response, body) {
		console.log(response.body);
		res.redirect("/");
	});
});

router.get('/logout', function(req, res) {
	delete req.session[req.session['username']];
	res.redirect('/');
});

module.exports = router;