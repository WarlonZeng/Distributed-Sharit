var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var mysql = require('mysql');
var configDB = require('../config/dbconfig.js');
var pool = new mysql.createPool(configDB);

router.get('/NYU/:subdomain_name', function(req, res) {
	var FIND_ALL_DOMAINS = 'SELECT domain_name, domain_id FROM domain';
    var FIND_ALL_SUBDOMAINS = 'SELECT domain_name, subdomain_name, subdomain_id FROM subdomain NATURAL JOIN domain';
	var find_subdomain_threads = 'SELECT * FROM domain NATURAL JOIN subdomain NATURAL JOIN thread NATURAL JOIN file WHERE subdomain_name = ? ORDER BY points DESC';
	
	pool.getConnection(function(err, client, done) {
		client.query(FIND_ALL_DOMAINS, [], function(err, ALL_DOMAINS) {
			client.query(FIND_ALL_SUBDOMAINS, [], function(err, ALL_SUBDOMAINS) {
				client.query(find_subdomain_threads, [req.params.subdomain_name], function(err, subdomain_threads) {
					client.release();
					res.json({ALL_DOMAINS, ALL_SUBDOMAINS, subdomain_threads});
				});
			});
		});
	});
});

router.post('/NYU/:subdomain_name', function(req, res) {
	var find_subdomain_threads = 'SELECT * FROM domain NATURAL JOIN subdomain NATURAL JOIN thread NATURAL JOIN file WHERE subdomain_name = ? ORDER BY points DESC';
	pool.getConnection(function(err, client, done) {
		client.query(find_subdomain_threads, [req.params.subdomain_name], function(err, subdomain_threads) {
			client.release();
			res.json({subdomain_threads});
		});
	});
});




router.post('/NYU/createSub', function(req, res) {
	//The LAST_INSERT_ID() function only returns the most recent autoincremented id value for the most recent INSERT operation, to any table, on your MySQL connection.
	
	var create_subdomain = 'INSERT INTO subdomain (subdomain_name, domain_id) VALUES(?, 1)';
	var insert_user_subdomain = 'INSERT INTO subdomain_user (subdomain_id, username, subdomain_moderator) VALUES(LAST_INSERT_ID(), ?, true)';
	var find_user_subdomains_in = 'SELECT * FROM subdomain_user NATURAL JOIN subdomain NATURAL JOIN domain_user NATURAL JOIN domain WHERE username = ?'
	
	pool.getConnection(function(err, client, done) {
		client.query(create_subdomain, [req.body.subdomain_name], function(err, result) {
			client.query(insert_user_subdomain, [req.body.username], function(err, result) { // changed result[0].id to LAST_INSERT_ID;
				client.query(find_user_subdomains_in, [req.body.username], function(err, result) {
					client.release();
					res.json(result);
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