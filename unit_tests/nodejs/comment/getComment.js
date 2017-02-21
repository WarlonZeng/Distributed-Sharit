var request = require('request');

var jsonBody = {
	thread_id: 1
}

request({
	url: 'http://localhost:3000/getComment',
	method: 'post',
	json: true,
	body: jsonBody
}, function (error, response, body) {
	console.log(response);
});