var express = require('express');
var pg = require('pg');
var router = express.Router();

var configDB = require('../config/dbconfig.js');
var pool = new pg.Pool(configDB);

router.get('/', function(req, res) {
	res.render('index');
});
//Add/Set permissions
router.post('/settings',function(req,res){
	var {type,id,username,username2add,thread,moderator}=req.body;
		pool.connect(function(err, client, done){
			var queryFind = 'SELECT username FROM users.user WHERE username=$1';
			var queryFindDomainUser='SELECT username FROM permission.domain_user WHERE domain_id=$1 and username=$2 and moderator="true"';
			var queryFindSubDomainUser='SELECT username FROM permission.subdomain_user WHERE subdomain=$1 and username=$2 and moderator="true"';
			var domainInsert = 'INSERT INTO permissions.domain_user VALUES($1, $2, $3)';
			var subInsert = 'INSERT INTO permissions.subdomain_user VALUES($1, $2, $3)';
			var domainChange = 'UPDATE permissions.domain_user SET moderator=$3 where domain_id=$1 and username=$2';
			var subdomainChange = 'UPDATE permissions.subdomain_user SET moderator=$3 where subdomain_id=$1 and username=$2';

			//Adds users to subdomain if current user is an admin
			if(type=="adddomain")
			{
			client.query(queryFindDomainUser, [id,username], function(err, result){
				if(err){
					console.log('Error running query', err);
					res.send('Server Error');
				}
				if(result.rows.length === 0){
					console.log('User not found');
					res.send('You do not have permission to add people to this domain.');
				}
				else {
					client.query(domainInsert, [id,username2add,false], function(err, result){
						if(err){
							console.log('Error running query', err);
							res.send('Server Error');
						}
						else{
						done();
						res.send("Success!");
					}
					done();
				})
		}
		done();
	})}
		else if(type=="addsubdomain")
		{
			client.query(queryFindSubDomainUser, [id,username], function(err, result){
				if(err){
					console.log('Error running query', err);
					res.send('Server Error');
				}
				if(result.rows.length === 0){
					console.log('User not found');
					res.send('You do not have permission to add people to this site.');
				}
				else {
					client.query(subInsert, [id,username2add,false], function(err, result){
						if(err){
							console.log('Error running query', err);
							res.send('Server Error');
						}
						done();
					})
		}
		done();
	})}
	else if(type=="moddomain")
	{
		client.query(queryFindDomainUser, [id,username], function(err, result){
			if(err){
				console.log('Error running query', err);
				res.send('Server Error');
			}
			if(result.rows.length === 0){
				console.log('User not found');
				res.send('You do not have permission to change people to this site.');
			}
			else {
				client.query(domainChange, [id,username2add,moderator], function(err, result){
					if(err){
						console.log('Error running query', err);
						res.send('Server Error');
					}
					done();
				})
	}
	done();
})}
	else if(type=="modsubdomain")
	{
		client.query(queryFindDomainUser, [id,username], function(err, result){
			if(err){
				console.log('Error running query', err);
				res.send('Server Error');
			}
			if(result.rows.length === 0){
				console.log('User not found');
				res.send('You do not have permission to change people to this site.');
			}
			else {
				client.query(subdomainChange, [id,username2add,moderator], function(err, result){
					if(err){
						console.log('Error running query', err);
						res.send('Server Error');
					}
					done();
				})
	}
	done();
})}
})});
