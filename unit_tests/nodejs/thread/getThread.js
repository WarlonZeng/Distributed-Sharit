var request = require('request');

var jsonBody = {
	subdomain_id: "1",
}

request({
	url: 'http://localhost:3000/getThread',
	method: 'post',
	json: true,
	body: jsonBody
}, function (error, response, body) {
	console.log(response);
});