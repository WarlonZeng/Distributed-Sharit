var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var configDB = require('../config/dbconfig.js');
var pool = new mysql.createPool(configDB);

router.get('/NYU/:subdomain_name', function(req, res) { // get all new fresh threads
	var FIND_ALL_DOMAINS = 'SELECT domain_name, domain_id FROM domain';
    var FIND_ALL_SUBDOMAINS = 'SELECT domain_name, subdomain_name, subdomain_id FROM subdomain NATURAL JOIN domain';
	var FIND_SUBDOMAIN_THREADS = 'SELECT * FROM domain NATURAL JOIN subdomain NATURAL JOIN thread NATURAL JOIN file WHERE subdomain_name = ? ORDER BY thread_points DESC';
	
	pool.getConnection(function(err, client, done) {
		client.query(FIND_ALL_DOMAINS, [], function(err, ALL_DOMAINS) {
			client.query(FIND_ALL_SUBDOMAINS, [], function(err, ALL_SUBDOMAINS) {
				client.query(FIND_SUBDOMAIN_THREADS, [req.params.subdomain_name], function(err, subdomain_threads) {
					client.release();
					res.json({
						ALL_DOMAINS, 
						ALL_SUBDOMAINS, 
						subdomain_threads
					});
				});
			});
		});
	});
});

router.post('/create_subdomain/NYU', function(req, res) {
	//The LAST_INSERT_ID() function only returns the most recent autoincremented id value for the most recent INSERT operation, to any table, on your MySQL connection.
	
	var create_subdomain_and_join_it = 'INSERT INTO subdomain (subdomain_name, domain_id) VALUES(?, 1); INSERT INTO subdomain_user (subdomain_id, username, subdomain_moderator) VALUES(LAST_INSERT_ID(), ?, true);';
	var find_user_subdomains_in = 'SELECT * FROM subdomain_user NATURAL JOIN subdomain NATURAL JOIN domain_user NATURAL JOIN domain WHERE username = ?';
	
	console.log(req.body.subdomain_name);
	console.log(req.body.username);

	pool.getConnection(function(err, client, done) {
		client.query(create_subdomain_and_join_it, [req.body.subdomain_name, req.body.username], function(err, result) {
			if (err) console.log(err);
			console.log(result);
			client.query(find_user_subdomains_in, [req.body.username], function(err, result) {
				client.release();
				console.log(result);
				res.json({
					user_subdomains_in: result
				});
			});
		});
	});
});

router.post('/join_subdomain/NYU', function(req, res) {
	var insert_user_into_subdomain = 'INSERT INTO subdomain_user (subdomain_id, username, subdomain_moderator) SELECT subdomain_id, ?, true FROM subdomain WHERE subdomain_name = ?'
	var find_user_subdomains_in = 'SELECT * FROM subdomain_user NATURAL JOIN subdomain NATURAL JOIN domain_user NATURAL JOIN domain WHERE username = ?';
	
	pool.getConnection(function(err, client, done) {
		client.query(insert_user_into_subdomain, [req.body.username, req.body.subdomain_name], function(err, result) {
			client.query(find_user_subdomains_in, [req.body.username], function(err, result) {
				client.release();
				res.json({
					user_subdomains_in: result
				});
			});
		});
	});
});

module.exports = router;