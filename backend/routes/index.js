var express = require('express');
var bcrypt = require('bcryptjs');
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

router.post('/register', function(req, res) {
	var queryFind = 'SELECT username FROM user WHERE username = ?'; // find user exists
	var queryInsert = 'INSERT INTO user (username, hash, first_name, last_name, email, phone, company, salt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'; // insert user
	var domainInsert = 'INSERT INTO domain_user (domain_id, username, moderator) VALUES(?, ?, ?)';
	var subInsert = 'INSERT INTO subdomain_user (subdomain_id, username, moderator) VALUES(?, ?, ?)';

	var salt =  bcrypt.genSaltSync(10);
	var {username, password, first_name, last_name, email, phone, company} = req.body;
	var hash = bcrypt.hashSync(password, salt);

	pool.getConnection(function(err, client, done) {  // working

		client.query(queryFind, [username], function(err, result) { 
			if (err) {
				res.json(err);
			}
			if (!result.length) {

				client.query(queryInsert, [username, hash, first_name, last_name, email, phone, company, salt], function(err, result) {
					if (err) {
						res.json(err);
					}

					client.query(domainInsert, [1, username, false], function(err, result) {
						if (err)
							res.json(err);
						client.release();

						for (var key in defaultSub) {
							client.query(subInsert, [defaultSub[key], username, false]);
						}
						res.json('Successful register, login to continue');
					});
				});
			}
			else {
				client.release();
				res.json('Unsuccessful register');
			}
		});
	});
});

router.get('/login', function(req, res){
	res.render('login');
});

router.post('/login', function(req, res) { // get all domains and subdomains this user is in
	var findSalt = 'SELECT salt FROM user WHERE username = ?';
	var validLogin = 'SELECT * FROM user WHERE username = ? and hash = ?';
	var find_user_domains_in = 'SELECT * from domain_user NATURAL JOIN domain WHERE username = ?';
	// var find_subdomains_user_in = 'SELECT * from subdomain_user as perm JOIN subdomain as dom ON (perm.subdomain_id = dom.id) WHERE username = ?';
	var find_user_subdomains_in = 'SELECT * FROM subdomain_user NATURAL JOIN subdomain NATURAL JOIN domain_user NATURAL JOIN domain WHERE username = ?'

	pool.getConnection(function(err, client, done) {
		client.query(findSalt, [req.body.username], function(err, result) {
			if (err) {
				console.log('Error running query', err);
				res.json('error', {error: err});
			}
			if (result.length !== 0) {
				var hash = bcrypt.hashSync(req.body.password, result[0].salt);

				client.query(validLogin, [req.body.username, hash], function(err, result) {
					if (result.length != 0) {
						client.query(find_user_domains_in, [req.body.username], function(err, user_domains_in) {
							client.query(find_user_subdomains_in, [req.body.username], function(err, user_subdomains_in) {
								client.release();

								var data = {username: req.body.username, user_domains_in, user_subdomains_in, sessionID: req.sessionID};
								res.json(data);
							});
						});
					}
					else {
						client.release();
						res.json("Invalid username or password");
					}
				});
			}
			else {
				client.release();
				res.json("Invalid username or password");
			}
		});
	});
});

module.exports = router;