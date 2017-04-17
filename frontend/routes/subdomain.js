var request = require('request');
var express = require('express');
var router = express.Router();

// currently fixed for NYU.. support for more domains can be considered via /d/

router.get('/NYU/:subdomain_name', function(req, res) {
	var url_name = 'http://localhost:3000/NYU/' + req.params.subdomain_name;

	if (req.session.data == null) {
	    request.get({
	        url: url_name,
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
	        url: url_name,
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
})

router.post('/create_subdomain', function(req, res) {
	//The LAST_INSERT_ID() function only returns the most recent autoincremented id value for the most recent INSERT operation, to any table, on your MySQL connection.

	var createSub = 'INSERT INTO subdomain (name, domain_id) VALUES(?, 1)';
	var userSub = 'INSERT INTO subdomain_user VALUES(LAST_INSERT_ID(), ?, true)';
	var findSubDomains = 'SELECT name, id from subdomain_user as perm JOIN subdomain as dom ON(perm.subdomain_id = dom.id) WHERE username = ?';
	
	pool.getConnection(function(err, client, done) {
		client.query(createSub, [req.body.subName], function(err, result) {
			client.query(userSub, [req.params.user], function(err, result) { // changed result[0].id to LAST_INSERT_ID;
				client.query(findSubDomains, [req.params.user], function(err, result) {
					client.release();
					req.session[req.params.user].subnav = result;
					res.redirect('/');
				})
			});
		})
	});
});

router.get('/joinSub/:subid', function(req, res) {

	if (req.session['username'] == null) {
		res.redirect('/auth');
	}

	if (req.session['username'] != null) {
		res.redirect('/auth');
	}

	var insertSub = 'insert into subdomain_user values(?, ?, false);';
	var findSubDomains = 'SELECT name, id from subdomain_user as perm JOIN subdomain as dom ON(perm.subdomain_id = dom.id) WHERE username = ?';
	
	pool.getConnection(function(err, client, done) {
		client.query(insertSub, [req.params.subid, req.params.user], function(err, result) {
			client.query(findSubDomains, [req.params.user], function(err, result) {
				client.release();
				req.session[req.session['username']].subnav = result;
				res.redirect('/');
			});
		});
	});
});

module.exports = router;