var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var configDB = require('../config/dbconfig.js');
var pool = new mysql.createPool(configDB);

router.post('/create_comment/NYU', function(req, res) {
	var create_comment = 'INSERT into comment(thread_id, author, comment) VALUES (?, ?, ?)';
	pool.getConnection(function(err, client) {
		client.query(create_comment, [req.body.thread_id, req.body.username, req.body.comment], function(err, result) {
			client.release();
			res.json("OK");
		});
	});
});

module.exports = router;