var express = require('express');

var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: destStr })
var destStr = 'uploads/';

var router = express.Router();
var mysql = require('mysql');
var configDB = require('../config/dbconfig.js');
var pool = new mysql.createPool(configDB);

router.get('/NYU/:sub/:subid/:user/:thread_id', function(req, res) {
	if (!req.session.hasOwnProperty(req.params.user)) {
		res.redirect('/');
	}

	var user = req.params.user;
	var threads = 'SELECT * FROM thread WHERE id = ?';
	var comments = 'SELECT * FROM comment WHERE thread_id = ? ORDER BY points DESC, date_posted DESC';
	var file = 'SELECT filename FROM thread JOIN file ON(thread.id = file.thread_id) WHERE thread_id = ?';

	pool.getConnection(function(err, client, done) {
		client.query(threads, [req.params.thread_id], function(err, thread) {
			client.query(comments, [req.params.thread_id], function(err, comments) {
				client.query(file, [req.params.thread_id], function(err, filename) {
					client.release();
					res.render('threadContent', {thread: thread[0], comments: comments, filename: filename[0], nav: req.session[user].nav, subnav: req.session[user].subnav, user: user, subid: req.params.subid, sub: req.params.sub, thread_id: req.params.thread_id});
				});	
			});
		});
	});
});

router.get('/NYU/:sub/:subid/:user/createThread', function(req, res) {
	if(!req.session.hasOwnProperty(req.params.user)) {
		res.redirect('/');
	}
	var user = req.params.user;
	res.render('createThread', {nav: req.session[user].nav, subnav: req.session[user].subnav, user: user, subid: req.params.subid, sub: req.params.sub});
});

router.post('/NYU/:sub/:subid/:user/createThread', upload.single('file'), function(req, res) {
	if(!req.session.hasOwnProperty(req.params.user)) {
		res.redirect('/');
	}

	var createThread;
	var linkFileToThread = 'INSERT INTO file (thread_id) VALUES (LAST_INSERT_ID());'

	pool.getConnection(function(err, client, done) {
		if (!req.file) { // no file
			createThread = 'INSERT INTO thread (subdomain_id, title, author, context) VALUES(?, ?, ?, ?);'; 
			client.query(createThread, [req.params.subid, req.body.title, req.params.user, req.body.context], function(err, result) {
				client.query(linkFileToThread, [], function(err, result) {
					if (err)
						console.log(err);
					client.release();
					res.redirect('/NYU/' + req.params.sub + '/' + req.params.subid + '/' + req.params.user);
				})
			});
		}
		else { // there is file
			if (err) console.log(err);
			createThread = 'INSERT INTO thread (subdomain_id, title, author, context) VALUES(?, ?, ?, ?);';
			client.query(createThread, [req.params.subid, req.body.title, req.params.user, req.body.context, req.file.originalname, req.file.filename], function(err, result) {
				client.query(linkFileToThread, [], function(err, result) {
					if (err) 
					console.log(err);
					client.release();
					res.redirect('/NYU/' + req.params.sub + '/' + req.params.subid + '/' + req.params.user);
				});
			});
		}
	});
});

router.get('/downloadFile/:thread_id', function(req, res){
	var downloadFile = 'SELECT filename, data FROM file WHERE thread_id = ?';

	pool.getConnection(function(err, client, done){
		client.query(downloadFile, [req.params.thread_id], function(err, result){
			client.release();
			var filename = result[0].filename;
    		var data = result[0].data;
    		res.set('Content-disposition', 'attachment;filename=' + filename);
    		res.send(new Buffer(data, 'binary'));
		});
	});
});

module.exports = router;