import requests
import json
import sys

jsonBody = {
	"thread_id": 1,
	"author": "admin",
	"comment": "some comment"
}

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
res = requests.post('http://localhost:3000/createComment', data = json.dumps(jsonBody), headers = headers)
print(res.json())