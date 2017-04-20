var request = require('request');
var express = require('express');
var router = express.Router();

var api = 'http://api.distributed-sharit.warloncs.net';

// REQUIRES:
// username
// subdomain_name
// thread_id
// comment
router.post('/create_comment/NYU/:subdomain_name/:thread_id', function(req, res) {
	if (req.session.data == null) { // because the form is embedded into this same page
		res.redirect('/login');
	}

	else if (req.session.data != null) {
        request.post({
            url: api + '/create_comment/NYU',
            json: true,
            form: {
            	username: req.session.data.username,
            	subdomain_name: req.params.subdomain_name,
            	thread_id: req.params.thread_id,
            	comment: req.body.comment
            }
        }, function(error, response, body) {
        	res.redirect('/NYU/' + req.params.subdomain_name + '/' + req.params.thread_id);
        });
    }
});

module.exports = router;