var fs = require('fs');
var multer = require('multer');
// var destStr = 'uploads/';
var storage = multer.memoryStorage();
// var upload = multer({ dest: destStr });
var upload = multer({storage: storage});

var request = require('request');
var express = require('express');
var router = express.Router();
var cassandra_config = require('../config/cassandra/cassandra_config.js');

var cassandra = require('cassandra-driver');
var client = new cassandra.Client(cassandra_config);

var api = 'http://api.distributed-sharit.warloncs.net';

// subdomain_name
// thread_id
// username
router.get('/NYU/:subdomain_name/:thread_id', function(req, res) {
    if (req.session.data == null) {
        request.get({
            url: api + '/NYU/' + req.params.subdomain_name + '/' + req.params.thread_id,
            json: true
        }, function(error, response, body) {
            res.render('view_thread', {
                nav: response.body.ALL_DOMAINS,
                subnav: response.body.ALL_SUBDOMAINS,
                thread: response.body.thread[0],
                comments: response.body.comments,
                filename: response.body.filename[0],
                subdomain_name: req.params.subdomain_name,
                logged: false,
                joined: false
            });
        });
    } 
    else if (req.session.data != null) {
        request.post({
            url: api + '/NYU/' + req.params.subdomain_name + '/' + req.params.thread_id,
            json: true,
            form: {username: req.session.data.username}
        }, function(error, response, body) {
            res.render('view_thread', {
                nav: req.session.data.user_domains_in,
                subnav: req.session.data.user_subdomains_in,
                thread: response.body.thread[0],
                comments: response.body.comments,
                filename: response.body.filename[0],
                subdomain_name: req.params.subdomain_name,
                logged: true,
                joined: !(response.body.joined)
            });
        });
    }
});

// subdomain_name
router.get('/create_thread/NYU/:subdomain_name', function(req, res) {
	if (req.session.data == null) {
		return res.redirect('/login');
	}
	res.render('create_thread', {subdomain_name: req.params.subdomain_name});
});

// subdomain_name
// username
// title
// context
// file
router.post('/create_thread/NYU/:subdomain_name', upload.single('file'), function(req, res) {
    console.log("req.body: ", req.body);
    console.log("req.params.subdomain_name: ", req.params.subdomain_name);
    console.log("req.file: ", req.file);

    if (req.session.data != null) {
        if (req.file) {
            var insert_file_into_database = 'INSERT INTO file (hash, filename, file_data) VALUES (?, ?, ?)';
            var hash = req.params.subdomain_name + '_' + req.session.data.username + '_' + req.file.originalname;
            client.execute(insert_file_into_database, [hash, req.file.originalname, req.file.buffer], function(err, result) {
                if (err) console.log(err);
                request.post({
                    url: api + '/create_thread/NYU',
                    json: true,
                    form: {
                        username: req.session.data.username,
                        subdomain_name: req.params.subdomain_name,
                        title: req.body.title,
                        context: req.body.context,
                        filename: req.file.originalname,
                        hash: hash
                    }
                }, function(error, response, body) {
                    res.redirect('/NYU/' + req.params.subdomain_name);
                });
            });
        } 
        else {
            request.post({
                url: api + '/create_thread/NYU',
                json: true,
                form: {
                    username: req.session.data.username,
                    subdomain_name: req.params.subdomain_name,
                    title: req.body.title,
                    context: req.body.context,
                    filename: null,
                    hash: null
                }
            }, function(error, response, body) {
                res.redirect('/NYU/' + req.params.subdomain_name);
            });
        }
    }
});
                    

router.get('/download_file/NYU/:thread_id', function(req, res) {
    request.post({
        url: api + '/download_file/NYU',
        json: true,
        form: {
            thread_id: req.params.thread_id
        }
    }, function(error, response, body) {
        var get_binary_data = 'SELECT filename, file_data FROM file WHERE hash = ?';
        client.execute(get_binary_data, [response.body.hash], function(err, result) {
            if (err) console.log(err);
            res.set('Content-disposition', 'attachment;filename=' + result[0].filename);
            res.send(new Buffer(result[0].data, 'binary'));
        });
    });
});

module.exports = router;