var express = require('express');
var router = express.Router();
var pg = require('pg');

var configDB = require('../config/dbconfig.js');
var pool = new pg.Pool(configDB);

router.get('/NYU/:user/createSub', function(req, res){
	if(! req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
	}
	var user = req.params.user;
	res.render('createSub', {user: user})
})

router.post('/NYU/:user/createSub', function(req, res){
	if(! req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
		return;
	}
	var createSub = 'INSERT INTO domains.subdomain (name, domain_id) VALUES($1, 1) RETURNING id';
	var userSub = 'INSERT INTO permissions.subdomain_user VALUES($1, $2, true)';
	var findsubDomains = 'SELECT name, id from permissions.subdomain_user as perm JOIN domains.subdomain as dom ON(perm.subdomain_id = dom.id) WHERE username = $1';
	pool.connect(function(err, client, done){
		client.query(createSub, [req.body.subName], function(err, result){
			client.query(userSub, [result.rows[0].id, req.params.user], function(err, result){
				client.query(findsubDomains, [req.params.user], function(err, result){
					done();
					req.session[req.params.user].subnav = result.rows;
					res.redirect('/?username=' + req.params.user);
				})
			});
		})
	});
});

router.get('/joinSub/:subid/:user', function(req, res){
	var insertSub = 'insert into permissions.subdomain_user values($1, $2, false);';
	var findsubDomains = 'SELECT name, id from permissions.subdomain_user as perm JOIN domains.subdomain as dom ON(perm.subdomain_id = dom.id) WHERE username = $1';
	pool.connect(function(err, client, done){
		client.query(insertSub, [req.params.subid, req.params.user], function(err, result){
			client.query(findsubDomains, [req.params.user], function(err, result){
				done();
				req.session[req.params.user].subnav = result.rows;
				res.redirect('/?username=' + req.params.user);
			});
		});
	});
});

module.exports = router;