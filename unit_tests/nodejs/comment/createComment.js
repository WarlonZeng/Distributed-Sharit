var request = require('request');

var jsonBody = {
	thread_id: 1,
	username: "admin",
	comment: "some comment"
}

request({
	url: 'http://localhost:3000/createComment',
	method: 'post',
	json: true,
	body: jsonBody
}, function (error, response, body) {
	console.log(response);
});