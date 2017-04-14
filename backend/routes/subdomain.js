var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var mysql = require('mysql');
var configDB = require('../config/dbconfig.js');
var pool = new mysql.createPool(configDB);

router.get('/:domain_name/:subdomain_name', function(req, res) {
	var findThreads = 'SELECT * FROM domain NATURAL JOIN subdomain NATURAL JOIN thread NATURAL JOIN file WHERE subdomain_name = ? ORDER BY points DESC';
	
	pool.getConnection(function(err, client, done) {
		client.query(findThreads, [req.params.subdomain_name], function(err, result) {
			client.release();
			// res.render('index', {threads: result, nav: req.session[user].nav, subnav: req.session[user].subnav, user: username, sub: req.params.subdomain_name});
			res.json({threads: result});
		});
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

	var insertSub = 'insert into subdomain_user (id, name, domain_id) values(?, ?, false);';
	var findSubDomains = 'SELECT name, id from subdomain_user as perm JOIN subdomain as dom ON(perm.subdomain_id = dom.id) WHERE username = ?';
	
	pool.getConnection(function(err, client, done) {
		client.query(insertSub, [req.params.subid, req.params.user], function(err, result) {
			client.query(findSubDomains, [req.params.user], function(err, result) {
				client.release();
				req.session[req.session['username']].subnav = result;
				// res.redirect('/');
				res.json({subnav: req.session[req.session['username']].subnav});
			});
		});
	});
});

module.exports = router;