import requests
import json
import sys
import base64

jsonBody = {
	'id': 1
}

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
res = requests.post('http://localhost:3000/downloadFile', data = json.dumps(jsonBody), headers = headers)
#print(res.json())
data = res.json()
#base64string = data[0]['encode']

#print(data)

recovered = data[0]['data']['data']
print(recovered)

f = open('downloaded_file.pdf', 'wb')
f.write(recovered)
f.close()