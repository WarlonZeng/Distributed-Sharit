var request = require('request');

request({
	url: 'http://localhost:3000',
	method: 'GET',
}, function (error, response) {
	console.log(response.body);
});