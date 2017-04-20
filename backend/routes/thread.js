// var fs = require('fs');
// var multer = require('multer');
// var upload = multer({ dest: destStr })
// var destStr = 'uploads/';

var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var configDB = require('../config/dbconfig.js');
var pool = new mysql.createPool(configDB);

// REQUIRES:
// subdomain_name
// thread_id
router.get('/NYU/:subdomain_name/:thread_id', function(req, res) {
	var FIND_ALL_DOMAINS = 'SELECT domain_name, domain_id FROM domain';
    var FIND_ALL_SUBDOMAINS = 'SELECT domain_name, subdomain_name, subdomain_id FROM subdomain NATURAL JOIN domain';

	var threads_info = 'SELECT * FROM thread WHERE thread_id = ?';
	var thread_comments = 'SELECT * FROM comment WHERE thread_id = ? ORDER BY comment_points DESC, date_posted DESC';
	var thread_file = 'SELECT filename FROM thread NATURAL JOIN file WHERE thread_id = ?';

	pool.getConnection(function(err, client, done) {
	    client.query(FIND_ALL_DOMAINS, [], function(err, ALL_DOMAINS) {
	        client.query(FIND_ALL_SUBDOMAINS, [], function(err, ALL_SUBDOMAINS) {
	            client.query(threads_info, [req.params.thread_id], function(err, thread) {
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

// REQUIRES:
// subdomain_name
// thread_id
router.post('/NYU/:subdomain_name/:thread_id', function(req, res) {
    var threads_info = 'SELECT * FROM thread WHERE thread_id = ?';
    var thread_comments = 'SELECT * FROM comment WHERE thread_id = ? ORDER BY comment_points DESC, date_posted DESC';
    var thread_file = 'SELECT filename FROM thread NATURAL JOIN file WHERE thread_id = ?';
    var find_user_joined_subdomain = 'SELECT * FROM subdomain_user NATURAL JOIN subdomain WHERE username = ? AND subdomain_name = ?';

    pool.getConnection(function(err, client, done) {
        client.query(threads_info, [req.params.thread_id], function(err, thread) {
            client.query(thread_comments, [req.params.thread_id], function(err, comments) {
                client.query(thread_file, [req.params.thread_id], function(err, filename) {
                    client.query(find_user_joined_subdomain, [req.body.username, req.params.subdomain_name], function(err, joined) {
                        if (joined.length != 0) {
                            client.release();
                            res.json({
	                            thread: thread,
	                            comments: comments,
	                            filename: filename,
                                joined: true
                            });
                        } 
                        else {
                            client.release();
                            res.json({
	                            thread: thread,
	                            comments: comments,
	                            filename: filename,
                                joined: false
                            });
                        }
                    });
                });
            });
        });
    });
});



// router.post('/NYU/:sub/:subid/:user/createThread', upload.single('file'), function(req, res) {
// REQUIRES: 
// subdomain_name
// username
// title
// context
// file
router.post('/create_thread/NYU', function(req, res) {
	pool.getConnection(function(err, client, done) {
		if (!req.body.file) { // no file
			var create_thread = 'INSERT INTO thread (subdomain_id, title, author, context) ' + 
			'SELECT subdomain_id, ?, ?, ? FROM subdomain WHERE subdomain_name = ?; INSERT INTO file (thread_id) VALUES (LAST_INSERT_ID());'; 
			client.query(create_thread, [req.body.title, req.body.username, req.body.context, req.body.subdomain_name], function(err, result) {
				if (err) console.log(err);
				res.json("OK");
			});
		}
		else if (req.body.file) { // there is file
			var create_thread = 'INSERT INTO thread (subdomain_id, title, author, context) ' + 
			'SELECT subdomain_id, ?, ?, ? FROM subdomain WHERE subdomain_name = ?; INSERT INTO file (thread_id) VALUES (LAST_INSERT_ID());'; 
			client.query(create_thread, [req.body.title, req.body.username, req.body.context, req.body.subdomain_name], function(err, result) {
				if (err) console.log(err);
				res.json("OK");
			});
		}
	});
});

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