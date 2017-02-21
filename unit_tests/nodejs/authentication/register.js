var request = require('request');

var jsonBody = {
	username: "wz634",
	password: "root",
	first_name: "warlon",
	last_name: "zeng",
	email: "wz634@nyu.edu",
	phone: "6463845208",
	company: "NYU"
}

request({
	url: 'http://localhost:3000/register',
	method: 'post',
	json: true,
	body: jsonBody
}, function (error, response, body) {
	console.log(response);
});