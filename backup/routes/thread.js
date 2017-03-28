var express = require('express');
var pg = require('pg');

var fs = require('fs');
var multer = require('multer');

var isWin = /^win/.test(process.platform);

var destStr = isWin ? 'C:/Program Files/PostgreSQL/9.6/data' : '/var/lib/postgresql/9.5/main';

var upload = multer({ dest: destStr })

var router = express.Router();

var configDB = require('../config/dbconfig.js');
var pool = new pg.Pool(configDB);

router.get('/NYU/:sub/:subid/:user/createThread', function(req, res){
	if(! req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
	}
	var user = req.params.user;
	res.render('createThread', {nav: req.session[user].nav, subnav: req.session[user].subnav, user: user, subid: req.params.subid, sub: req.params.sub});
});

// 5 user params: subdomain_id, title, author, context, file
// creates thread w/ file if attached
// file uploaded in postgres' default db folder
router.post('/NYU/:sub/:subid/:user/createThread', upload.single('file'), function(req, res){
	if(! req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
		return;
	}
	var createThread;
	pool.connect(function(err, client, done){
		if (!req.file) { // no file
			createThread = 'WITH created_thread_id AS (INSERT INTO posts.thread(subdomain_id, title, author, context) VALUES($1, $2, $3, $4) RETURNING id) INSERT INTO posts.file(thread_id) SELECT id FROM created_thread_id';

			client.query(createThread, [req.params.subid, req.body.title, req.params.user, req.body.context], function(err, result){
				if (err) console.log(err);
				
				done();
				res.redirect('/NYU/' + req.params.sub + '/' + req.params.subid + '/' + req.params.user);
			});
		}
		else { // there is file
			if (err) console.log(err);
			createThread = 'WITH created_thread_id AS ' + 
			'(INSERT INTO posts.thread(subdomain_id, title, author, context) ' + 
			'VALUES($1, $2, $3, $4) ' + 'RETURNING id) ' + 
			'INSERT INTO posts.file(thread_id, filename, data) ' + 
			'SELECT id, $5, pg_read_binary_file($6)::bytea ' + 
			'FROM created_thread_id';
			
			client.query(createThread, [req.params.subid, req.body.title, req.params.user, req.body.context, req.file.originalname, req.file.filename], function(err, result){
				if (err) console.log(err);
					
				done();
				res.redirect('/NYU/' + req.params.sub + '/' + req.params.subid + '/' + req.params.user);
			});
		}
	});
});

// reteive all comments, file and thread info
// 1 user param: thread_id
// returns all information about thread_id, file name and id (use downloadFile route to get file), comments
router.get('/NYU/:sub/:subid/:user/:thread_id', function(req, res){
	if(! req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
		return;
	}
	var user = req.params.user;
	var threads = 'SELECT * FROM posts.thread WHERE id = $1';
	var comments = 'SELECT * FROM posts.comment WHERE thread_id=$1 ORDER BY points DESC, date_posted DESC';
	var file = 'SELECT filename FROM posts.thread JOIN posts.file ON(thread.id = file.thread_id) WHERE thread_id = $1';

	pool.connect(function(err, client, done){
		client.query(threads, [req.params.thread_id], function(err, thread){
			client.query(comments, [req.params.thread_id], function(err, comments){
				client.query(file, [req.params.thread_id], function(err, filename){
					res.render('threadContent', {thread: thread.rows[0], comments: comments.rows, filename: filename.rows[0], nav: req.session[user].nav, subnav: req.session[user].subnav, user: user, subid: req.params.subid, sub: req.params.sub, thread_id: req.params.thread_id})
				});	
			});
		});
	});
});

function getPoints(client, id, res, done, query){
	client.query(query, [id], function(err, result){
		done();
		res.json(result.rows[0]);
	})
}

router.get('/voteThread/:user/:thread_id/:rating', function(req, res){
	if(! req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
		return;
	}
	var voteThread = 'INSERT INTO ratings."ThreadRating"(thread_id, username, rating) VALUES($1, $2, $3)';
	var queryFind = 'SELECT username FROM ratings."ThreadRating" WHERE thread_id = $1 and username = $2';
	var updateVote = 'UPDATE ratings."ThreadRating" SET rating = $3 WHERE thread_id = $1 and username = $2';
	var findPoints = 'SELECT points FROM posts.thread WHERE id = $1';

	pool.connect(function(err, client, done){
		client.query(queryFind, [req.params.thread_id, req.params.user], function(err, result){
			if (result.rows.length === 0) { // user rating not found, so insert new rating
				client.query(voteThread, [req.params.thread_id, req.params.user, req.params.rating], function(err, result){
					getPoints(client, req.params.thread_id, res, done, findPoints);
				});
			}
			else {
				client.query(updateVote, [req.params.thread_id, req.params.user, req.params.rating], function(err, result){
					getPoints(client, req.params.thread_id, res, done, findPoints);
				});
			}
			done();
		});
	});
});

router.get('/downloadFile/:thread_id', function(req, res){
	var downloadFile = 'SELECT filename, data FROM posts.file WHERE thread_id = $1';

	pool.connect(function(err, client, done){
		client.query(downloadFile, [req.params.thread_id], function(err, result){
			done();
			var filename = result.rows[0].filename;
    		var data = result.rows[0].data;
    		
    		res.set('Content-disposition', 'attachment;filename=' + filename);
    		res.send(new Buffer(data, 'binary'));
		});
	});
});

module.exports = router;