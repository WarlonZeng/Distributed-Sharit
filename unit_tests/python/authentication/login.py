import requests
import json
import sys

userData = {
	"username": "wz634",
	"password": "root",
}

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
requests.post('http://localhost:3000/login', data = json.dumps(userData), headers = headers)