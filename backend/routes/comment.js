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

router.post('/create_comment/NYU', function(req, res) {
	var create_comment = 'INSERT into comment(thread_id, author, comment) VALUES (?, ?, ?)';
	poolCluster.getConnection('MASTER', function(err, client) {
		client.query(create_comment, [req.body.thread_id, req.body.username, req.body.comment], function(err, result) {
			client.release();
			res.json("OK");
		});
	});
});

module.exports = router;