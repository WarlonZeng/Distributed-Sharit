var express = require('express');
var bcrypt = require('bcryptjs');

var router = express.Router();
var mysql = require('mysql');
var configDB = require('../config/dbconfig.js');
var pool = new mysql.createPool(configDB);

var defaultSub = {
	Bio: 1,
	Math: 2,
	CS: 3,
	Chem: 4
}

var ALL_DOMAINS;
var ALL_SUBDOMAINS;
var ALL_THREADS;

var FIND_ALL_DOMAINS = 'SELECT name, id FROM domain';
var FIND_ALL_SUBDOMAINS = 'SELECT name, id FROM subdomain';
var FIND_ALL_THREADS = 'SELECT * FROM subdomain NATURAL JOIN thread NATURAL JOIN file';

pool.getConnection(function(err, client, done) {
	client.query(FIND_ALL_DOMAINS, [], function(err, result) {
		ALL_DOMAINS = result;
		client.query(FIND_ALL_SUBDOMAINS, [], function(err, result) {
			ALL_SUBDOMAINS = result;
			client.query(FIND_ALL_THREADS, [], function(err, result) {
				client.release();
				ALL_THREADS = result;
			});
		});
	});
});

router.get('/', function(req, res) { // General domains and subdomains
	res.json({ALL_DOMAINS, ALL_SUBDOMAINS, ALL_THREADS, logged: false});
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
				res.json({user_threads, user_subdomains_not_in, logged: true}); 
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
				res.render('error', {error: err})
			}
			if (!result.length) {

				client.query(queryInsert, [username, hash, first_name, last_name, email, phone, company, salt], function(err, result) {
					if (err) {
						res.render('error', {error: err})
					}

					client.query(domainInsert, [1, username, false], function(err, result) {
						client.release();
						if (err) 
							console.log('Error running query', err);
						for (var key in defaultSub) {
							client.query(subInsert, [defaultSub[key], username, false]);
						}

						res.redirect('/login');
					});
				});
			}
			else {
				client.release();
				res.redirect('/register');
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
						client.query(findDomains, [req.body.username], function(err, user_domains) {
							client.query(findsubDomains, [req.body.username], function(err, user_subdomains) {
								client.release();
								
								var data = {username: req.body.username, user_domains, user_subdomains, sessionID: req.sessionID};
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