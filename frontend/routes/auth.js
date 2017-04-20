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