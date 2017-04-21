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

// REQUIRES: 
// username
// thread_id
// rating
router.post('/vote_thread/NYU', function(req, res) {
	var update_thread_points = 'INSERT INTO thread_rating (thread_id, username, rating) VALUES (?, ?, ?); ' + 
	'UPDATE thread SET thread_points = thread_points + ? WHERE thread_id = ?;'
	var find_thread_points = 'SELECT thread_points FROM thread WHERE thread_id = ?';

	poolCluster.getConnection('MASTER', function(err, client) {
		client.query(update_thread_points, [req.body.thread_id, req.body.username, req.body.rating, req.body.rating, req.body.thread_id], function(err, result) {
			client.query(find_thread_points, [req.body.thread_id], function(err, result) {
				res.json({points: result[0]});	
			});
		});
	});
});

// REQUIRES: 
// username
// comment_id
// rating
router.post('/vote_comment/NYU', function(req, res) {
	var update_comment_pointss = 'INSERT INTO comment_rating (comment_id, username, rating) VALUES (?, ?, ?); ' + 
	'UPDATE comment SET comment_points = comment_points + ? WHERE comment_id = ?;'
	var find_comment_points = 'SELECT comment_points FROM comments WHERE comment_id = ?';

	poolCluster.getConnection('MASTER', function(err, client) {
		client.query(update_comment_points, [req.body.comment_id, req.body.username, req.body.rating, req.body.rating, req.body.comment_id], function(err, result) {
			client.query(find_comment_points, [req.body.comment_id], function(err, result) {
				res.json({points: result[0]});		
			});
		});
	});
});


module.exports = router;