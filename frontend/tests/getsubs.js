var request = require('request');

var api = 'http://api.distributed-sharit.warloncs.net';

request.get({
    url: api + '/NYU/' + 'cooking',
    json: true
}, function(error, response, body) {
    console.log(response.body);
});