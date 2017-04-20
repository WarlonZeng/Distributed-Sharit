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
		res.render('view_thread', {
			nav: response.body.ALL_DOMAINS, 
			subnav: response.body.ALL_SUBDOMAINS,
	    	thread: response.body.thread[0],
	    	comments: response.body.comments,
	    	filename: response.body.filename[0],
	    	subdomain_name: req.params.subdomain_name,
	    	logged: false
	    });
	});
});

router.get('/create_thread/NYU/:subdomain_name', function(req, res) {
	if (req.session.data == null) {
		return res.redirect('/login');
	}
	res.render('create_thread', {subdomain_name: req.params.subdomain_name});
});

// router.post('/create_thread/NYU/:subdomain_name', upload.single('file'), function(req, res) {
router.post('/create_thread/NYU/:subdomain_name', function(req, res) { // get back to this for file

	console.log("req.body: ", req.body);
	console.log("req.params.subdomain_name: ", req.params.subdomain_name);
	console.log("req.file: ", req.file);

    if (req.session.data != null) {

        request.post({
            url: 'http://localhost:3000/create_thread/NYU/' + req.params.subdomain_name,
            json: true,
            form: {
                title: req.body.title,
                context: req.body.context,
                subdomain_name: req.params.subdomain_name,
                username: req.session.data.username,
                file: req.file
            }
        }, function(error, response, body) {
        	res.redirect('/NYU/' + req.params.subdomain_name);
        });
    }
});

router.get('/downloadFile/:thread_id', function(req, res) { // get get back to thsi for file
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