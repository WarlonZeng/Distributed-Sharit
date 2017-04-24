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

var bcrypt = require('bcryptjs');

var defaultSub = {
	All: 0,
	Bio: 1,
	Math: 2,
	CS: 3,
	Chem: 4
}

router.post('/register', function(req, res) {
	var find_user = 'SELECT username FROM user WHERE username = ?'; // find user exists
	var insert_user_into_database = 'INSERT INTO user (username, salt, hash) VALUES (?, ?, ?)'; // insert user
	var add_user_domains = 'INSERT INTO domain_user (domain_id, username, domain_moderator) VALUES(?, ?, ?)';
	var add_user_subdomains = 'INSERT INTO subdomain_user (subdomain_id, username, subdomain_moderator) VALUES(?, ?, ?)';

	console.log(req.body);

	var salt =  bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(req.body.password, salt);

	poolCluster.getConnection('MASTER', function(err, client) {

		client.query(find_user, [req.body.username], function(err, result) {
			console.log(result);
			if (err) {
				console.log(err);
				console.log('Unsuccessful register');
				client.release();
				return res.json('Unsuccessful register');
			}
			else if (result.length == 0 || result == null) { // if empty
				console.log('inserting user into database');
				client.query(insert_user_into_database, [req.body.username, salt, hash], function(err, result) {
					if (err) {
						console.log(err);
						console.log('Unsuccessful register');
						client.release();
						return res.json('Unsuccessful register');
					}
					client.query(add_user_domains, [1, req.body.username, false], function(err, result) {
						if (err) {
							console.log(err);
							console.log('Unsuccessful register');
							client.release();
							return res.json('Unsuccessful register');
						}
						for (var key in defaultSub) {
							client.query(add_user_subdomains, [defaultSub[key], req.body.username, false]);
						}
						client.release();
						console.log('Successful register');
						res.json("OK");
					});
				});
			}
			else {
				client.release();
				return res.json('Unsuccessful register');
			}
		});
	});
});

router.post('/login', function(req, res) { // get all domains and subdomains this user is in
	var findSalt = 'SELECT salt FROM user WHERE username = ?';
	var validLogin = 'SELECT * FROM user WHERE username = ? and hash = ?';
	var find_user_domains_in = 'SELECT * from domain_user NATURAL JOIN domain WHERE username = ?';
	// var find_subdomains_user_in = 'SELECT * from subdomain_user as perm JOIN subdomain as dom ON (perm.subdomain_id = dom.id) WHERE username = ?';
	var find_user_subdomains_in = 'SELECT * FROM subdomain_user NATURAL JOIN subdomain NATURAL JOIN domain_user NATURAL JOIN domain WHERE username = ?'

	poolCluster.getConnection('SLAVE*', function(err, client) {
		client.query(findSalt, [req.body.username], function(err, result) {
			if (err) {
				console.log('Error running query', err);
				res.json('error', {error: err});
			}
			if (result.length != 0 || result == null) {
				var hash = bcrypt.hashSync(req.body.password, result[0].salt);

				client.query(validLogin, [req.body.username, hash], function(err, result) {
					if (result.length != 0) {
						client.query(find_user_domains_in, [req.body.username], function(err, user_domains_in) {
							client.query(find_user_subdomains_in, [req.body.username], function(err, user_subdomains_in) {
								client.release();

								var data = {username: req.body.username, user_domains_in, user_subdomains_in, sessionID: req.sessionID, logged: true};
								res.json(data);
							});
						});
					}
					else {
						client.release();
						res.json('Unsuccessful login');
					}
				});
			}
			else {
				client.release();
				res.json('Unsuccessful login');
			}
		});
	});
});

module.exports = router;