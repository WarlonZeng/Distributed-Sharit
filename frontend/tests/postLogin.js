var request = require('request');

request.post({
    url: 'http://localhost:3000/login',
    form: {"username":"wz634", "password":"root"}
}, function(error, response, body){
	console.log(response.body);
    request.get({
        url:"http://localhost:3000",
        header: response.headers
    },function(error, response, body){
        // The full html of the authenticated page
        console.log(body);
    });
});