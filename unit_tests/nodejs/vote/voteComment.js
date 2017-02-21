var request = require('request');

var jsonBody = {
	vote: 1,
	comment_id: 1
}

request({
	url: 'http://localhost:3000/voteComment',
	method: 'post',
	json: true,
	body: jsonBody
}, function (error, response, body) {
	console.log(response);
});