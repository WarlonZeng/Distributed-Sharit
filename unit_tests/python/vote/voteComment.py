import requests
import json
import sys

jsonBody = {
	"comment_id": 1,
	"username": 'admin',
	"rating": 1
}

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
res = requests.post('http://localhost:3000/voteComment', data = json.dumps(jsonBody), headers = headers)
print(res.json())