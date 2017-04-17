var request = require('request');
var express = require('express');
var router = express.Router();

// currently fixed for NYU.. support for more domains can be considered via /d/

router.get('/NYU/:subdomain_name', function(req, res) {
	if (req.session.data == null) {
	    request.get({
	        url: 'http://localhost:3000/NYU/' + req.params.subdomain_name,
	        json: true
	    }, function(error, response, body) {
	        res.render('view_subdomain', {
				nav: response.body.ALL_DOMAINS, 
				subnav: response.body.ALL_SUBDOMAINS,
	            threads: response.body.subdomain_threads,
	            subdomain_name: req.params.subdomain_name,
	            logged: false
	        });
	    });
	}

	if (req.session.data != null) {
	    request.post({
	        url: 'http://localhost:3000/NYU/' + req.params.subdomain_name,
	        json: true
	    }, function(error, response, body) {
	        res.render('view_subdomain', {
	            nav: req.session.data.user_domains_in,
	            subnav: req.session.data.user_subdomains_in,
	            threads: response.body.subdomain_threads,
	            subdomain_name: req.params.subdomain_name,
	            logged: true
	        });
	    });
	}
});

router.get('/create_subdomain', function(req, res) {
	if (req.session.data == null) {
		res.redirect('/login');
	}
	res.render('create_subdomain');
});

router.post('/create_subdomain', function(req, res) { // does not require req.params. addition; variable directly from forms
	if (req.session.data != null) {
	    request.post({
	        url: 'http://localhost:3000/create_subdomain',
	        json: true,
	        form: {
	        	subdomain_name: req.body.subdomain_name,
	        	username: req.session.data.username
	        }
	    }, function(error, response, body) {
	    	req.session.data.user_subdomains_in = response.body.user_subdomains_in;
	    	console.log(req.session.data);
	    	res.redirect('/');
	    });
	}
});

router.get('/join_subdomain/:subdomain_name', function(req, res) {
	if (req.session.data == null) {
		res.redirect('/login');
	}

	if (req.session.data != null) {
	    request.post({
	        url: 'http://localhost:3000/join_subdomain',
	        json: true,
	        form: {
	        	subdomain_name: req.params.subdomain_name,
	        	username: req.session.data.username
	        }
	    }, function(error, response, body) {
	    	req.session.data.user_subdomains_in = response.body.user_subdomains_in;
	    	console.log(req.session.data);
	    	res.redirect('/');
	    });
	}
});

module.exports = router;