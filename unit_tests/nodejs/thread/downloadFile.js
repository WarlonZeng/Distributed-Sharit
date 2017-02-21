var request = require('request');

var jsonBody = {
	id: 1
}

request({
	url: 'http://localhost:3000/downloadFile',
	method: 'post',
	json: true,
	body: jsonBody
}, function (error, response, body) {
	console.log(response);
});