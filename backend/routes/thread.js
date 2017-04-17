// var fs = require('fs');
// var multer = require('multer');
// var upload = multer({ dest: destStr })
// var destStr = 'uploads/';

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var configDB = require('../config/dbconfig.js');
var pool = new mysql.createPool(configDB);

router.get('/NYU/:subdomain_name/:thread_id', function(req, res) {
	var FIND_ALL_DOMAINS = 'SELECT domain_name, domain_id FROM domain';
    var FIND_ALL_SUBDOMAINS = 'SELECT domain_name, subdomain_name, subdomain_id FROM subdomain NATURAL JOIN domain';

	var threads_meta = 'SELECT * FROM thread WHERE thread_id = ?';
	var thread_comments = 'SELECT * FROM comment WHERE thread_id = ? ORDER BY comment_points DESC, date_posted DESC';
	var thread_file = 'SELECT filename FROM thread NATURAL JOIN file WHERE thread_id = ?';

	pool.getConnection(function(err, client, done) {
	    client.query(FIND_ALL_DOMAINS, [], function(err, ALL_DOMAINS) {
	        client.query(FIND_ALL_SUBDOMAINS, [], function(err, ALL_SUBDOMAINS) {
	            client.query(threads_meta, [req.params.thread_id], function(err, thread) {
	                client.query(thread_comments, [req.params.thread_id], function(err, comments) {
	                    client.query(thread_file, [req.params.thread_id], function(err, filename) {
	                        client.release();
	                        res.json({
	                            ALL_DOMAINS,
	                            ALL_SUBDOMAINS,
	                            thread: thread,
	                            comments: comments,
	                            filename: filename
	                        });
	                    });
	                });
	            });
	        });
	    });
	});
});


// router.get('/NYU/:sub/:subid/:user/createThread', function(req, res) {
// 	if(!req.session.hasOwnProperty(req.params.user)) {
// 		res.redirect('/');
// 	}
// 	var user = req.params.user;
// 	res.render('createThread', {nav: req.session[user].nav, subnav: req.session[user].subnav, user: user, subid: req.params.subid, sub: req.params.sub});
// });

// router.post('/NYU/:sub/:subid/:user/createThread', upload.single('file'), function(req, res) {
// 	if(!req.session.hasOwnProperty(req.params.user)) {
// 		res.redirect('/');
// 	}

// 	var createThread;
// 	var linkFileToThread = 'INSERT INTO file (thread_id) VALUES (LAST_INSERT_ID());'

// 	pool.getConnection(function(err, client, done) {
// 		if (!req.file) { // no file
// 			createThread = 'INSERT INTO thread (subdomain_id, title, author, context) VALUES(?, ?, ?, ?);'; 
// 			client.query(createThread, [req.params.subid, req.body.title, req.params.user, req.body.context], function(err, result) {
// 				client.query(linkFileToThread, [], function(err, result) {
// 					if (err)
// 						console.log(err);
// 					client.release();
// 					res.redirect('/NYU/' + req.params.sub + '/' + req.params.subid + '/' + req.params.user);
// 				})
// 			});
// 		}
// 		else { // there is file
// 			if (err) console.log(err);
// 			createThread = 'INSERT INTO thread (subdomain_id, title, author, context) VALUES(?, ?, ?, ?);';
// 			client.query(createThread, [req.params.subid, req.body.title, req.params.user, req.body.context, req.file.originalname, req.file.filename], function(err, result) {
// 				client.query(linkFileToThread, [], function(err, result) {
// 					if (err) 
// 					console.log(err);
// 					client.release();
// 					res.redirect('/NYU/' + req.params.sub + '/' + req.params.subid + '/' + req.params.user);
// 				});
// 			});
// 		}
// 	});
// });

// router.get('/downloadFile/:thread_id', function(req, res){
// 	var downloadFile = 'SELECT filename, data FROM file WHERE thread_id = ?';

// 	pool.getConnection(function(err, client, done){
// 		client.query(downloadFile, [req.params.thread_id], function(err, result){
// 			client.release();
// 			var filename = result[0].filename;
//     		var data = result[0].data;
//     		res.set('Content-disposition', 'attachment;filename=' + filename);
//     		res.send(new Buffer(data, 'binary'));
// 		});
// 	});
// });

module.exports = router;