var express = require('express');
var bcrypt = require('bcryptjs');

//var fs = require('fs');
//var multer = require('multer');
//var upload = multer({ dest: destStr })

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

/* GET home page. */
router.get('/', function(req, res) {
	var user = req.query.username;
	var findAllThreads = 'SELECT subdomain_id, username, thread.id, author, date_posted, title, context, points, name, filename ' +
	'FROM (subdomain_user natural join thread natural join file) join subdomain on(thread.subdomain_id = subdomain.id) WHERE username = ? ORDER BY points DESC, date_posted DESC';
	var findSubUserNotIn = 'select id, name from subdomain where id not in' + '(select subdomain_id from subdomain_user where username = ?) order by name;';
	
	if (user) {
		console.log(user);

		pool.getConnection(function(err, client, done) {

			client.query(findAllThreads, [user], function(err, result) {

				client.query(findSubUserNotIn, [user], function(err, subs) {

					client.release();
					res.render('initial', {nav: req.session[user].nav, subnav: req.session[user].subnav, logged: true, user: user, threads: result, subs: subs});
				})
			});
		});
	}

	else {
		res.render('initial', {logged: false});
	}
});

router.get('/login', function(req, res){
	res.render('login');
});

router.get('/register', function(req, res){
	res.render('register');
});

router.post('/register', function(req, res){
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
						if (err) 
							console.log('Error running query', err);
						for (var key in defaultSub) {
							client.query(subInsert, [defaultSub[key], username, false]);
						}

						client.release();
						res.redirect('/');
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

router.post('/login', function(req, res) {
	var findSalt = 'SELECT salt FROM user WHERE username = ?';
	var validLogin = 'SELECT * FROM user WHERE username = ? and hash = ?';
	var findDomains = 'SELECT name, id from domain_user NATURAL JOIN domain WHERE username = ?';
	var findsubDomains = 'SELECT name, id from subdomain_user as perm JOIN subdomain as dom ON (perm.subdomain_id = dom.id) WHERE username = ?';
	
	pool.getConnection(function(err, client, done) {
		if (err) {
			console.log('Error running query', err);
			res.render('error', {error: err})
		}

		client.query(findSalt, [req.body.username], function(err, result) {
			if (err) {
				console.log('Error running query', err);
				res.render('error', {error: err})
			}

			if (result.length !== 0) {
				var hash = bcrypt.hashSync(req.body.password, result[0].salt);

				client.query(validLogin, [req.body.username, hash], function(err, result) {
					if (result.length != 0) {
						
						client.query(findDomains, [req.body.username], function(err, result) {
							var domains = result;

							client.query(findsubDomains, [req.body.username], function(err, result) {
								client.release();
								var subs = result;
								req.session[req.body.username] = {nav: domains, subnav: subs};
								res.redirect('/?username=' + req.body.username);
							});
						});
					}
					else {
						client.release();
						res.redirect('/login');
					}
				});
			}
			else {
				client.release();
				res.redirect('/login');
			}
		});
	});
});

router.get('/logout/:user', function(req, res) {
	delete req.session[req.params.user];
	res.redirect('/');
});

module.exports = router;