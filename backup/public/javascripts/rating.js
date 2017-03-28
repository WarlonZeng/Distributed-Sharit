var upVoteCom = document.getElementsByClassName('upVoteCom');
var downVoteCom = document.getElementsByClassName('downVoteCom');
var upVoteThread = document.getElementsByClassName('upVoteThread');
var downVoteThread = document.getElementsByClassName('downVoteThread');

Array.prototype.forEach.call(upVoteCom, function(ele){
	ele.addEventListener('click', handleUpCom);
});

Array.prototype.forEach.call(downVoteCom, function(ele){
	ele.addEventListener('click', handleDownCom);
});

Array.prototype.forEach.call(upVoteThread, function(ele){
	ele.addEventListener('click', handleUpThread);
});

Array.prototype.forEach.call(downVoteThread, function(ele){
	ele.addEventListener('click', handleDownThread);
});

function handleUpCom(evt){
	var url = evt.srcElement.attributes.info.nodeValue;
	sendAJAX(url, evt, 'up');
	this.style.border = "2px solid green";
	/*if(evt.srcElement.attributes.voted && evt.srcElement.attributes.voted.nodeValue === 'up'){}
	else{
		this.setAttribute('voted', 'up');
		
		evt.srcElement.nextSibling.nextSibling.nextSibling.textContent = parseInt(evt.srcElement.nextSibling.nextSibling.nextSibling.textContent) + 1;
		sendAJAX(url);
	}*/
}

function handleUpThread(evt){
	var url = evt.srcElement.attributes.info.nodeValue;
	sendAJAX(url, evt, 'up');
	this.style.border = "2px solid green";
	/*if(evt.srcElement.attributes.voted && evt.srcElement.attributes.voted.nodeValue === "up"){}
	else{
		this.setAttribute('voted', 'up');
		var url = evt.srcElement.attributes.info.nodeValue;
		evt.srcElement.nextSibling.nextSibling.nextSibling.textContent = parseInt(evt.srcElement.nextSibling.nextSibling.nextSibling.textContent) + 1;
		sendAJAX(url);
	}*/
}

function handleDownCom(evt){
	var url = evt.srcElement.attributes.info.nodeValue;
	sendAJAX(url, evt, 'down');
	this.style.border = "2px solid red";
	/*if(evt.srcElement.attributes.voted && evt.srcElement.attributes.voted.nodeValue === 'down'){}
	else{
		this.setAttribute('voted', 'down');
		var url = evt.srcElement.attributes.info.nodeValue;
		evt.srcElement.previousSibling.previousSibling.previousSibling.textContent = parseInt(evt.srcElement.previousSibling.previousSibling.previousSibling.textContent) - 1;
		sendAJAX(url);
	}*/
}

function handleDownThread(evt){
	var url = evt.srcElement.attributes.info.nodeValue;
	sendAJAX(url, evt, 'down');
	this.style.border = "2px solid red";
	/*if(evt.srcElement.attributes.voted && evt.srcElement.attributes.voted.nodeValue === "down"){}
	else{
		this.setAttribute('voted', 'down');
		var url = evt.srcElement.attributes.info.nodeValue;
		evt.srcElement.previousSibling.previousSibling.previousSibling.textContent = parseInt(evt.srcElement.previousSibling.previousSibling.previousSibling.textContent) - 1;
		sendAJAX(url);
	}*/
}

function sendAJAX(url, evt, direction){
	var req = new XMLHttpRequest();
	req.open('GET', url);
	req.addEventListener('load', function(){
		var output = JSON.parse(this.responseText);
		if(direction === 'up'){
			evt.srcElement.nextSibling.nextSibling.nextSibling.textContent = output.points;
		}else{
			evt.srcElement.previousSibling.previousSibling.previousSibling.textContent = output.points;
		}
	})
	console.log('sending to', url);
	req.send();
}
