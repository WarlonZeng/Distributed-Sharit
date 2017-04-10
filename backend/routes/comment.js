var express = require('express');

var router = express.Router();
var mysql = require('mysql');
var configDB = require('../config/dbconfig.js');
var pool = new mysql.createPool(configDB);

router.post('/NYU/:sub/:subid/:user/:thread_id', function(req, res) {
	if(!req.session.hasOwnProperty(req.params.user)) {
		res.redirect('/');
	}
	var createComment = 'INSERT into comment(thread_id, author, comment) values(?, ?, ?)';
	pool.getConnection(function(err, client) {
		client.query(createComment, [req.params.thread_id, req.params.user, req.body.comment], function(err, result) {
			client.release();
			res.redirect('/NYU/' + req.params.sub + '/' + req.params.subid + '/' + req.params.user + '/' + req.params.thread_id);
		});
	});
});

module.exports = router;