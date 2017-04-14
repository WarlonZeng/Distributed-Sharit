require('./server_initialization');

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
	var find_all_threads = 'SELECT * FROM domain NATURAL JOIN subdomain NATURAL JOIN thread NATURAL JOIN file';
	pool.getConnection(function(err, client, done) {
		client.query(find_all_threads, [], function(err, all_threads) {
			client.release();
			all_threads = result;
		});
	}
	res.json({ALL_DOMAINS, ALL_SUBDOMAINS, all_threads, LOGGED: false});
});

router.post('/', function(req, res) { // User specific domains and subdomains
	var username = req.body.username;

	var findUserThreads = 'SELECT subdomain_id, username, thread.id, author, date_posted, title, context, points, name, filename ' +
	'FROM (subdomain_user natural join thread natural join file) join subdomain on(thread.subdomain_id = subdomain.id) WHERE username = ? ORDER BY points DESC, date_posted DESC';
	var findSubUserNotIn = 'select id, name from subdomain where id not in' + '(select subdomain_id from subdomain_user where username = ?) order by name;';

	pool.getConnection(function(err, client, done) {
		client.query(findUserThreads, [username], function(err, user_threads) {
			client.query(findSubUserNotIn, [username], function(err, user_subdomains_not_in) {
				client.release();
				res.json({user_threads, user_subdomains_not_in}); 
			});
		});
	});
})

router.post('/register', function(req, res) {
	var salt =  bcrypt.genSaltSync(10);
	var {username, password, first_name, last_name, email, phone, company} = req.body;
	var hash = bcrypt.hashSync(password, salt);

	var queryFind = 'SELECT username FROM user WHERE username = ?'; // find user exists
	var queryInsert = 'INSERT INTO user (username, hash, first_name, last_name, email, phone, company, salt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'; // insert user
	var domainInsert = 'INSERT INTO domain_user (domain_id, username, moderator) VALUES(?, ?, ?)';
	var subInsert = 'INSERT INTO subdomain_user (subdomain_id, username, moderator) VALUES(?, ?, ?)';

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
	var findDomains = 'SELECT name, id from domain_user NATURAL JOIN domain WHERE username = ?';
	var findsubDomains = 'SELECT name, id from subdomain_user as perm JOIN subdomain as dom ON (perm.subdomain_id = dom.id) WHERE username = ?';
	
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
						client.query(findDomains, [req.body.username], function(err, NAV_DOMAINS) {
							client.query(findsubDomains, [req.body.username], function(err, SUBNAV_DOMAINS) {
								client.release();

								var data = {username: req.body.username, NAV_DOMAINS, SUBNAV_DOMAINS, sessionID: req.sessionID, LOGGED: true};
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