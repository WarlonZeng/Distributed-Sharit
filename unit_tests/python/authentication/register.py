import requests
import json
import sys

userData = {
	"username": "wz634",
	"password": "root",
	"first_name": "warlon",
	"last_name": "zeng",
	"email": "wz634@nyu.edu",
	"phone": "6463845208",
	"company": "NYU"
}

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
requests.post('http://localhost:3000/register', data = json.dumps(userData), headers = headers)

