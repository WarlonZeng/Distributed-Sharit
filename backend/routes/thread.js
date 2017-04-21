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
// subdomain_name
// thread_id
router.get('/NYU/:subdomain_name/:thread_id', function(req, res) {
	var FIND_ALL_DOMAINS = 'SELECT domain_name, domain_id FROM domain';
    var FIND_ALL_SUBDOMAINS = 'SELECT domain_name, subdomain_name, subdomain_id FROM subdomain NATURAL JOIN domain';

	var threads_info = 'SELECT * FROM thread WHERE thread_id = ?';
	var thread_comments = 'SELECT * FROM comment WHERE thread_id = ? ORDER BY comment_points DESC, date_posted DESC';
	var thread_file = 'SELECT filename FROM thread NATURAL JOIN file WHERE thread_id = ?';

	poolCluster.getConnection('SLAVE*', function(err, client) {
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

    poolCluster.getConnection('SLAVE*', function(err, client) {
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
	poolCluster.getConnection('MASTER', function(err, client) {

		console.log(req.body);
		console.log(req.file);

		if (!req.body.filename) { // no file
			console.log('no file');
			var create_thread = 'INSERT INTO thread (subdomain_id, title, author, context) ' + 
			'SELECT subdomain_id, ?, ?, ? FROM subdomain WHERE subdomain_name = ?; INSERT INTO file (thread_id) VALUES (LAST_INSERT_ID());'; 
			client.query(create_thread, [req.body.title, req.body.username, req.body.context, req.body.subdomain_name], function(err, result) {
				if (err) console.log(err);
				res.json("OK");
			});
		}
		else if (req.body.filename) { // there is file
			console.log('file received');
			var create_thread = 'INSERT INTO thread (subdomain_id, title, author, context) ' + 
			'SELECT subdomain_id, ?, ?, ? FROM subdomain WHERE subdomain_name = ?; INSERT INTO file (thread_id, filename, hash) VALUES (LAST_INSERT_ID(), ?, ?);'; 
			client.query(create_thread, [req.body.title, req.body.username, req.body.context, req.body.subdomain_name, req.body.filename, req.body.hash], function(err, result) {
				if (err) console.log(err);
				res.json("OK");
			});
		}
	});
});

router.post('/download_file/NYU', function(req, res) {
	var get_file_hash = 'SELECT hash FROM file WHERE thread_id = ?';

	poolCluster.getConnection('SLAVE*', function(err, client) {
		client.query(get_file_hash, [req.body.thread_id], function(err, hash) {
			client.release();
			res.json(hash[0]);
		});
	});
});

module.exports = router;
