var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var configDB = require('../config/dbconfig.js');
var pool = new mysql.createPool(configDB);

var defaultSub = {
	All: 0,
	Bio: 1,
	Math: 2,
	CS: 3,
	Chem: 4
}

router.get('/', function(req, res) { // General domains and subdomains
	var FIND_ALL_DOMAINS = 'SELECT domain_name, domain_id FROM domain';
    var FIND_ALL_SUBDOMAINS = 'SELECT domain_name, subdomain_name, subdomain_id FROM subdomain NATURAL JOIN domain';
	var FIND_ALL_THREADS = 'SELECT * FROM domain NATURAL JOIN subdomain NATURAL JOIN thread NATURAL JOIN file';

	pool.getConnection(function(err, client, done) {
		client.query(FIND_ALL_DOMAINS, [], function(err, ALL_DOMAINS) {
			client.query(FIND_ALL_SUBDOMAINS, [], function(err, ALL_SUBDOMAINS) {
				client.query(FIND_ALL_THREADS, [], function(err, ALL_THREADS) {
					client.release();
					res.json({ALL_DOMAINS, ALL_SUBDOMAINS, ALL_THREADS});
				});
			});
		});
	});
});

router.post('/', function(req, res) { // User specific domains and subdomains
	var find_user_subdomain_not_in = 'SELECT subdomain_name FROM subdomain WHERE subdomain_id NOT IN (SELECT subdomain_id FROM subdomain_user WHERE username = ?) ORDER BY subdomain_name';
	var find_user_threads_in = 'SELECT * FROM subdomain_user NATURAL JOIN domain_user NATURAL JOIN thread NATURAL JOIN file NATURAL JOIN subdomain NATURAL JOIN domain WHERE username = ? ORDER BY thread_points DESC, date_posted DESC '
	
	pool.getConnection(function(err, client, done) {
		client.query(find_user_subdomain_not_in, [req.body.username], function(err, user_subdomains_not_in) {
			client.query(find_user_threads_in, [req.body.username], function(err, user_threads_in) {
				client.release();
				res.json({user_subdomains_not_in, user_threads_in}); 
			});
		});
	});
})

module.exports = router;