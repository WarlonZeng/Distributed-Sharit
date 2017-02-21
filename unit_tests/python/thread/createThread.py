import requests
import json
import sys

jsonBody = {
	"subdomain_id": 1,
	"title": "new title",
	"author": "admin",
	"context": "new context"
}

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
res = requests.post('http://localhost:3000/createThread', data = json.dumps(jsonBody), headers = headers)
print(res.json())