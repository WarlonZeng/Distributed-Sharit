import requests
import json
import sys

jsonBody = {
	"thread_id": 1,
	"username": 'admin',
	"rating": 1
}

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
res = requests.post('http://localhost:3000/voteThread', data = json.dumps(jsonBody), headers = headers)
print(res.json())