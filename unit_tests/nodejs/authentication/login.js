var request = require('request');

var jsonBody = {
	username: "wz634",
	password: "root",
}

request({
	url: 'http://localhost:3000/login',
	method: 'post',
	json: true,
	body: jsonBody
}, function (error, response, body) {
	console.log(response);
});
