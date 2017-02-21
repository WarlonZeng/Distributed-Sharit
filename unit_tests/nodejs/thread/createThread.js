var request = require('request');

var jsonBody = {
	subdomain_id: 1,
	title: "some title",
	author: "admin",
	context: "some context"
}

request({
	url: 'http://localhost:3000/createThread',
	method: 'post',
	json: true,
	body: jsonBody
}, function (error, response, body) {
	console.log(response);
});