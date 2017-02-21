import requests
import json
import sys

# userData = {
# 	"username": "wz634",
# 	"password": "root",
# }

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
r = requests.get('http://localhost:3000/');
r.json();