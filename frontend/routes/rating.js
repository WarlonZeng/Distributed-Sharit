var request = require('request');
var express = require('express');
var router = express.Router();

// function getPoints(client, id, res, done, query) {
// 	client.query(query, [id], function(err, result) {
// 		res.json(result[0]);
// 	})
// }

router.get('/vote_thread/:thread_id/:rating', function(req, res){
	if (req.session.data == null) {
		res.redirect('/login');
	}

	// var update_thread_points = 

	var queryFind = 'SELECT username FROM thread_ratings WHERE thread_id = ? and username = ?';
	var voteThread = 'INSERT INTO thread_ratings (thread_id, username, rating) VALUES(?, ?, ?)';
	var updateVote = 'UPDATE thread_ratings SET rating = ? WHERE thread_id = ? and username = ?';
	var updateThreadPoints = 'UPDATE thread SET points = points + ? WHERE thread_id = ? and username = ?'
	var findPoints = 'SELECT points FROM thread WHERE id = ?';

	console.log('hi');

	pool.getConnection(function(err, client, done) {
		client.query(queryFind, [req.params.thread_id, req.params.user], function(err, result) { // if did not vote
			if (result.length === 0) {
				client.query(voteThread, [req.params.thread_id, req.params.user, req.params.rating], function(err, result) { // vote
 					getPoints(client, req.params.thread_id, res, done, findPoints);
 					client.release();
				});
			}
			else if (result[0].rating != req.params.rating) { // make sure we only update the opposite 
				client.query(updateVote, [req.params.rating, req.params.thread_id, req.params.user], function(err, result) {
					client.query(updateThreadPoints, [req.params.rating, req.params.thread_id, req.params.user], function(err, result) {
						getPoints(client, req.params.thread_id, res, done, findPoints);
						client.release();
					});
				});
			}
		});
	});
});

router.get('/voteComment/:user/:comment_id/:rating', function(req, res) {
	if(!req.session.hasOwnProperty(req.params.user)) {
		res.redirect('/');
	}

	var voteComment = 'INSERT INTO comment_rating (comment_id, username, rating) VALUES(?, ?, ?)';
	var queryFind = 'SELECT username FROM comment_rating WHERE comment_id = ? and username = ?';
	var updateVote = 'UPDATE comment_rating SET rating = ? WHERE comment_id = ? and username = ?';
	var updateThreadPoints = 'UPDATE thread SET points = points + ? WHERE thread_id = ? and username = ?'
	var findPoints = 'SELECT points FROM comment WHERE id = ?';

	pool.getConnection(function(err, client, done) {
		client.query(queryFind, [req.params.comment_id, req.params.user], function(err, result) {
			if (result.length === 0) {
				client.query(voteComment, [req.params.comment_id, req.params.user, req.params.rating], function(err, result) {
					getPoints(client, req.params.comment_id, res, done, findPoints);
					client.release();
				});
			}
			else if (result[0].rating != req.parms.rating) {
				client.query(updateVote, [req.params.rating, req.params.comment_id, req.params.user], function(err, result) {
					client.query(updateThreadPoints, [req.params.rating, req.params.thread_id, req.params.user], function(err, result) {
						getPoints(client, req.params.thread_id, res, done, findPoints);
						client.release();
					});
				});
			}
		});
	});
});



module.exports = router;