var express = require('express');
var pg = require('pg');
var fs = require('fs');
var router = express.Router();

var configDB = require('../config/dbconfig.js');
var pool = new pg.Pool(configDB);

// create comment
router.post('/NYU/:sub/:subid/:user/:thread_id', function(req, res){
	if(! req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
		return;
	}
	var createComment = 'INSERT into posts.comment(thread_id, author, comment) values($1, $2, $3)';
	pool.connect(function(err, client, done){
		client.query(createComment, [req.params.thread_id, req.params.user, req.body.comment], function(err, result){
			done();
			res.redirect('/NYU/' + req.params.sub + '/' + req.params.subid + '/' + req.params.user + '/' + req.params.thread_id);
		});
	});
});

function getPoints(client, id, res, done, query){
	client.query(query, [id], function(err, result){
		done();
		res.json(result.rows[0]);
	})
}

router.get('/voteComment/:user/:comment_id/:rating', function(req, res){
	if(! req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
		return;
	}
	var voteComment = 'INSERT INTO ratings."CommentRating"(comment_id, username, rating) VALUES($1, $2, $3)';
	var queryFind = 'SELECT username FROM ratings."CommentRating" WHERE comment_id = $1 and username = $2';
	var updateVote = 'UPDATE ratings."CommentRating" SET rating = $3 WHERE comment_id = $1 and username = $2';
	var findPoints = 'SELECT points FROM posts.comment WHERE id = $1';

	pool.connect(function(err, client, done){
		client.query(queryFind, [req.params.comment_id, req.params.user], function(err, result){
			if (result.rows.length === 0) { // user rating not found, so insert new rating
				client.query(voteComment, [req.params.comment_id, req.params.user, req.params.rating], function(err, result){
					getPoints(client, req.params.comment_id, res, done, findPoints);
				});
			}
			else {
				client.query(updateVote, [req.params.comment_id, req.params.user, req.params.rating], function(err, result){
					getPoints(client, req.params.comment_id, res, done, findPoints);
				});
			}
			done();
		});
	});
});

module.exports = router;