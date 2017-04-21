var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var poolCluster = mysql.createPoolCluster();
var master_config = require('../config/mysql/master_config.js');
var slave1_config = require('../config/mysql/slave1_config.js');
var slave2_config = require('../config/mysql/slave2_config.js');
poolCluster.add('MASTER', master_config);
poolCluster.add('SLAVE1', slave1_config);
poolCluster.add('SLAVE2', slave2_config);

var async = require('async');
import parallel from 'async/parallel';

// subdomain_name
router.get('/NYU/:subdomain_name', function(req, res) { // get all new fresh threads
	var FIND_ALL_DOMAINS = 'SELECT domain_name, domain_id FROM domain';
    var FIND_ALL_SUBDOMAINS = 'SELECT domain_name, subdomain_name, subdomain_id FROM subdomain NATURAL JOIN domain';
	var FIND_SUBDOMAIN_THREADS = 'SELECT * FROM domain NATURAL JOIN subdomain NATURAL JOIN thread NATURAL JOIN file WHERE subdomain_name = ? ORDER BY thread_points DESC';
	
	poolCluster.getConnection('SLAVE*', function(err, client) {
		// client.query(FIND_ALL_DOMAINS, [], function(err, ALL_DOMAINS) {
		// 	client.query(FIND_ALL_SUBDOMAINS, [], function(err, ALL_SUBDOMAINS) {
		// 		client.query(FIND_SUBDOMAIN_THREADS, [req.params.subdomain_name], function(err, subdomain_threads) {
		// 			client.release();
		// 			res.json({
		// 				ALL_DOMAINS, 
		// 				ALL_SUBDOMAINS, 
		// 				subdomain_threads
		// 			});
		// 		});
		// 	});
		// });
		async.parallel([
			client.query(FIND_ALL_DOMAINS, [], function(err, ALL_DOMAINS) {if (err) console.log(err)}),
			client.query(FIND_ALL_SUBDOMAINS, [], function(err, ALL_SUBDOMAINS) {if (err) console.log(err)}),
			client.query(FIND_SUBDOMAIN_THREADS, [req.params.subdomain_name], function(err, subdomain_threads) {if (err) console.log(err)})
		], function(err, results) {
			client.release();
			res.json({
				ALL_DOMAINS, 
				ALL_SUBDOMAINS, 
				subdomain_threads
			});
		});
	});
});


// subdomain_name
router.post('/NYU/:subdomain_name', function(req, res) { // get all new fresh threads
    var FIND_SUBDOMAIN_THREADS = 'SELECT * FROM domain NATURAL JOIN subdomain NATURAL JOIN thread NATURAL JOIN file WHERE subdomain_name = ? ORDER BY thread_points DESC';
    var find_user_joined_subdomain = 'SELECT * FROM subdomain_user NATURAL JOIN subdomain WHERE username = ? AND subdomain_name = ?';

    poolCluster.getConnection('SLAVE*', function(err, client) {
        // client.query(FIND_SUBDOMAIN_THREADS, [req.params.subdomain_name], function(err, subdomain_threads) {
        //     client.query(find_user_joined_subdomain, [req.body.username, req.params.subdomain_name], function(err, joined) {
        //         if (joined.length != 0) {
        //             client.release();
        //             res.json({
        //                 subdomain_threads,
        //                 joined: true
        //             });
        //         } 
        //         else {
        //             client.release();
        //             res.json({
        //                 subdomain_threads,
        //                 joined: false
        //             });
        //         }
        //     });
        // });
		async.parallel([
			client.query(FIND_SUBDOMAIN_THREADS, [req.params.subdomain_name], function(err, subdomain_threads) {if (err) console.log(err)}),
			client.query(find_user_joined_subdomain, [req.body.username, req.params.subdomain_name], function(err, joined) {if (err) console.log(err)})
		], function(err, results) {
			client.release();
			if (joined.length != 0) {
				client.release();
				res.json({
					subdomain_threads,
					joined: true
				});
			} 
			else {
				client.release();
				res.json({
					subdomain_threads,
					joined: false
				});
			}
		});
    });
});


// subdomain_name
// username
router.post('/create_subdomain/NYU', function(req, res) {
	//The LAST_INSERT_ID() function only returns the most recent autoincremented id value for the most recent INSERT operation, to any table, on your MySQL connection.
	
	var create_subdomain_and_join_it = 'INSERT INTO subdomain (subdomain_name, domain_id) VALUES(?, 1); INSERT INTO subdomain_user (subdomain_id, username, subdomain_moderator) VALUES(LAST_INSERT_ID(), ?, true);';
	var find_user_subdomains_in = 'SELECT * FROM subdomain_user NATURAL JOIN subdomain NATURAL JOIN domain_user NATURAL JOIN domain WHERE username = ?';
	
	console.log(req.body.subdomain_name);
	console.log(req.body.username);

	poolCluster.getConnection('MASTER', function(err, client) {
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

// subdomain_name
// username
router.post('/join_subdomain/NYU', function(req, res) {
	var insert_user_into_subdomain = 'INSERT INTO subdomain_user (subdomain_id, username, subdomain_moderator) SELECT subdomain_id, ?, true FROM subdomain WHERE subdomain_name = ?'
	var find_user_subdomains_in = 'SELECT * FROM subdomain_user NATURAL JOIN subdomain NATURAL JOIN domain_user NATURAL JOIN domain WHERE username = ?';
	
	poolCluster.getConnection('MASTER', function(err, client) {
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