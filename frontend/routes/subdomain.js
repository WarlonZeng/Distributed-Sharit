var express = require('express');
var router = express.Router();

router.get('/:domain_name/:subdomain_name', function(req, res) {
	request.get({
    	url: 'http://localhost:3000/' + req.params.domain_name + req.params.subdomain_name,
    	json: true
	}, function(error, response, body) {
		console.log("response.body:", response.body);
		res.render('index', {nav: req.session.data, subnav: response.body.ALL_SUBDOMAINS, subs: response.body.ALL_SUBDOMAINS, threads: response.body.ALL_THREADS, logged: logged});
	});
});

router.get('/NYU/createSub', function(req, res) {
	if (!req.session.hasOwnProperty(req.params.user)) {
		res.redirect('/');
	}
	var user = req.params.user;
	res.render('createSub', {user: user})
})

router.post('/NYU/createSub', function(req, res) {
	
	//The LAST_INSERT_ID() function only returns the most recent autoincremented id value for the most recent INSERT operation, to any table, on your MySQL connection.
	
	if (!req.session.hasOwnProperty(req.params.user)) {
		res.redirect('/');
	}
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