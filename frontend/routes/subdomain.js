var request = require('request');
var express = require('express');
var router = express.Router();

var api = 'http://api.distributed-sharit.warloncs.net';

// currently fixed for NYU.. support for more domains can be considered via /d/

// REQUIRES:
// username
// subdomain_name
router.get('/NYU/:subdomain_name', function(req, res) { // get all new fresh threads

	if (req.session.data == null) {
		request.get({
	    	url: api + '/NYU/' + req.params.subdomain_name,
	    	json: true
		}, function(error, response, body) {
			res.render('view_subdomain', {
				nav: response.body.ALL_DOMAINS, 
				subnav: response.body.ALL_SUBDOMAINS,
	    		threads: response.body.subdomain_threads,
	    		subdomain_name: req.params.subdomain_name,
	    		logged: false,
	    		joined: false
	    	});
		});
	}

	else if (req.session.data != null) {
		request.post({
	    	url: api + '/NYU/' + req.params.subdomain_name,
	    	json: true,
	    	form: {username: req.session.data.username}
		}, function(error, response, body) {

			console.log(response.body.joined);

			res.render('view_subdomain', {
				nav: req.session.data.user_domains_in,
				subnav: req.session.data.user_subdomains_in,
	    		threads: response.body.subdomain_threads,
	    		subdomain_name: req.params.subdomain_name,
	    		logged: true,
	    		joined: !(response.body.joined)
	    	});
		});
	}
});

// REQUIRES:
// username
router.get('/create_subdomain/NYU', function(req, res) { // returns subdomain_name
	if (req.session.data == null) {
		return res.redirect('/login');
	}
	res.render('create_subdomain');
});

// REQUIRES:
// subdomain_name
// username
router.post('/create_subdomain/NYU', function(req, res) { // does not require req.params. addition; variable directly from forms
	if (req.session.data != null) {
	    request.post({
	        url: api + '/create_subdomain/NYU',
	        json: true,
	        form: {
	        	username: req.session.data.username,
	        	subdomain_name: req.body.subdomain_name
	        }
	    }, function(error, response, body) {
	    	req.session.data.user_subdomains_in = response.body.user_subdomains_in;
	    	res.redirect('/');
	    });
	}
});

// REQUIRES:
// subdomain_name
// username
router.get('/join_subdomain/NYU/:subdomain_name', function(req, res) { // NYU/join_subdomain/cooking
	if (req.session.data == null) {
		return res.redirect('/login');
	}

	if (req.session.data != null) {
	    request.post({
	        url: api + '/join_subdomain/NYU',
	        json: true,
	        form: {
	        	username: req.session.data.username,
	        	subdomain_name: req.params.subdomain_name
	        }
	    }, function(error, response, body) {
	    	req.session.data.user_subdomains_in = response.body.user_subdomains_in;
	    	// res.redirect('/NYU/' + req.params.subdomain_name);
	    	res.redirect('back');
	    });
	}
});

module.exports = router;