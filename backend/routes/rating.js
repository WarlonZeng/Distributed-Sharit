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
 
// username
// thread_id
// rating
router.post('/vote_thread/NYU', function(req, res) {
	var find_if_voted = 'SELECT rating FROM thread_rating WHERE username = ? AND thread_id = ?';
	var update_user_rating_and_thread_points = 'UPDATE thread_rating SET rating = rating + ? WHERE username = ?;' + 
	'UPDATE thread SET thread_points = thread_points + ? WHERE thread_id = ?';
	var insert_user_rating_and_thread_points = 'INSERT INTO thread_rating (thread_id, username, rating) VALUES (?, ?, ?);' + 
	'UPDATE thread SET thread_points = thread_points + ? WHERE thread_id = ?';
	var find_thread_points = 'SELECT thread_points FROM thread WHERE thread_id = ?';

	console.log(req.body.rating);

	poolCluster.getConnection('MASTER', function(err, client) {
		client.query(find_if_voted, [req.body.username, req.body.thread_id], function(err, result) {
			console.log(result);
			if (result.length != 0) {
				if (result[0].rating == req.body.rating) { // person voted the same rating, dismiss
					client.query(find_thread_points, [req.body.thread_id], function(err, result) {
						res.json(result[0]);
					});
				}
				else if (result[0].rating != req.body.rating) {
					client.query(update_user_rating_and_thread_points, [req.body.rating, req.body.username, req.body.rating, req.body.thread_id], function(err, result) {
						client.query(find_thread_points, [req.body.thread_id], function(err, result) {
							res.json({points: result[0]});
						});
					});
				}
			}
			else {
				client.query(insert_user_rating_and_thread_points, [req.body.thread_id, req.body.username, req.body.rating, req.body.rating, req.body.thread_id], function(err, result) {
					client.query(find_thread_points, [req.body.thread_id], function(err, result) {
						res.json(result[0]);
					});
				});
			}
		});
	});
});
 
// username
// comment_id
// rating
router.post('/vote_comment/NYU', function(req, res) {
	var find_if_voted = 'SELECT rating FROM comment_rating WHERE username = ? AND comment_id = ?';
	var update_user_rating_and_comment_points = 'UPDATE comment_rating SET rating = rating + ? WHERE username = ?;' + 
	'UPDATE comment SET comment_points = comment_points + ? WHERE comment_id = ?';
	var insert_user_rating_and_comment_points = 'INSERT INTO comment_rating (comment_id, username, rating) VALUES (?, ?, ?);' + 
	'UPDATE comment SET comment_points = comment_points + ? WHERE comment_id = ?;'
	var find_comment_points = 'SELECT comment_points FROM comment WHERE comment_id = ?';

	poolCluster.getConnection('MASTER', function(err, client) {
		client.query(find_if_voted, [req.body.username, req.body.comment_id], function(err, result) {
			console.log(result);
			if (result.length != 0) {
				if (result[0].rating == req.body.rating) { // person voted the same rating, dismiss
					client.query(find_comment_points, [req.body.comment_id], function(err, result) {
						res.json({points: result[0]});
					});
				}
				else if (result[0].rating != req.body.rating) {
					client.query(update_user_rating_and_comment_points, [req.body.rating, req.body.username, req.body.rating, req.body.comment_id], function(err, result) {
						client.query(find_comment_points, [req.body.comment_id], function(err, result) {
							res.json({points: result[0]});
						});
					});
				}
			}
			else { console.log('first time voting');
				client.query(insert_user_rating_and_comment_points, [req.body.comment_id, req.body.username, req.body.rating, req.body.rating, req.body.comment_id], function(err, result) { if (err) console.log(err);
					client.query(find_comment_points, [req.body.comment_id], function(err, result) {
						res.json({points: result[0]});
					});
				});
			}
		});
	});
});


module.exports = router;
