var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: destStr })
var destStr = 'uploads/';

var request = require('request');
var express = require('express');
var router = express.Router();

router.get('/NYU/:subdomain_name/:thread_id', function(req, res) {
	request.get({
	    url: 'http://localhost:3000/NYU/' + req.params.subdomain_name + '/' + req.params.thread_id,
	    json: true
	}, function(error, response, body) {
		if (req.session.data == null) {
			res.render('view_thread', {
				nav: response.body.ALL_DOMAINS, 
				subnav: response.body.ALL_SUBDOMAINS,
	    		thread: response.body.thread[0],
	    		comments: response.body.comments,
	    		filename: response.body.filename[0],
	    		subdomain_name: req.params.subdomain_name,
	    		logged: false
	    	});
		}
	    
		if (req.session.data != null) {
	        res.render('view_thread', {
				nav: req.session.data.user_domains_in, 
				subnav: req.session.data.user_subdomains_in,
	    		thread: response.body.thread[0],
	    		comments: response.body.comments,
	    		filename: response.body.filename[0],
	    		subdomain_name: req.params.subdomain_name,
	    		logged: true
	    	});
		}
	});
});

router.get('/NYU/create_thread/:subdomain_name', function(req, res) {
	if (req.session.data == null) {
		res.redirect('/');
	}
	res.render('create_thread');
});

router.post('/NYU/create_thread/:subdomain_name', upload.single('file'), function(req, res) {
	if (req.session.data != null) {

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