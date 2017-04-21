var request = require('request');
var express = require('express');
var router = express.Router();

var api = 'http://api.distributed-sharit.warloncs.net';

// REQUIRES: 
// username
// thread_id
// rating
router.get('/vote_thread/NYU/:thread_id/:rating', function(req, res) {
	if (req.session.data == null) {
		res.redirect('/login');
	}

	else if (req.session.data != null) {
		request.post({ // because fkn hui made a native XMLHttpRequest in GET
            url: api + '/vote_thread/NYU',
            json: true,
            form: {
            	username: req.session.data.username,
            	thread_id: req.params.thread_id,
            	rating: req.params.rating
            }
        }, function(error, response, body) {
        	console.log(response.body);
            res.json({points: response.body[0]});
        });
	}
});

// REQUIRES: 
// username
// comment_id
// rating
router.get('/vote_comment/NYU/:comment_id/:rating', function(req, res) {
	if (req.session.data == null) {
		res.redirect('/login');
	}

	else if (req.session.data != null) {
		request.post({ // because fkn hui made a native XMLHttpRequest in GET
            url: api + '/vote_comment/NYU',
            json: true,
            form: {
            	username: req.session.data.username,
            	comment_id: req.params.comment_id,
            	rating: req.params.rating
            }
        }, function(error, response, body) {
            console.log(response.body);
        	res.json({points: response.body[0]});
        });
	}
});


module.exports = router;