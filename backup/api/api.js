var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: destStr })

var pg = require('pg')
var configDB = require('../config/dbconfig.js');
var isWin = /^win/.test(process.platform);
var destStr = isWin ? 'C:/Program Files/PostgreSQL/9.6/data' : '/var/lib/postgresql/9.5/main';
var pool = new pg.Pool(configDB);

var defaultSub = {
	Bio: 1,
	Math: 2,
	CS: 3,
	Chem: 4
}

function getPoints(client, id, res, done, query){
	client.query(query, [id], function(err, result){
		done();
		res.json(result.rows[0]);
	})
}

// Index - Default information
/* GET home page. */
router.get('/', function(req, res) {
	var user = req.query.username;
	var findAllThreads = 'SELECT subdomain_id, username, thread.id, author, date_posted, title, context, points, name, filename ' +
	'FROM (permissions.subdomain_user natural join posts.thread natural join posts.file) join domains.subdomain on(thread.subdomain_id = subdomain.id) WHERE username = $1 ORDER BY points DESC, date_posted DESC';
	var findSubUserNotIn = 'select id, name from domains.subdomain where id not in'+
'		(select subdomain_id from permissions.subdomain_user where username=$1) order by name;';

	if(user){
		pool.connect(function(err, client, done){
			client.query(findAllThreads, [user], function(err, result){
				client.query(findSubUserNotIn, [user], function(err, subs){
					done();
					res.render('initial', {nav: req.session[user].nav, subnav: req.session[user].subnav, logged: true, user: user, threads: result.rows, subs: subs.rows});
				})
			});
		});
		//res.render('initial', {nav: req.session[user].nav, subnav: req.session[user].subnav, logged: false, user: user});
	}else{
		res.render('initial', {logged: false});
	}
});

router.get('/login', function(req, res){
	res.render('login');
});

router.get('/register', function(req, res){
	res.render('register');
});

router.post('/register', function(req, res){
	var salt =  bcrypt.genSaltSync(10);
	var {username, password, first_name, last_name, email, phone, company} = req.body;
	var hash = bcrypt.hashSync(password, salt);
	var queryFind = 'SELECT username FROM users.user WHERE username=$1';
	var queryInsert = 'INSERT INTO users.user(username, hash, first_name, last_name, email, phone, company, salt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING username';
	var domainInsert = 'INSERT INTO permissions.domain_user VALUES($1, $2, $3)';
	var subInsert = 'INSERT INTO permissions.subdomain_user VALUES($1, $2, $3)';
	pool.connect(function(err, client, done){

		client.query(queryFind, [username], function(err, result){
			if(err){
				return res.render('error', {error: err})
			}
			if(result.rows.length === 0){
				client.query(queryInsert, [username, hash, first_name, last_name, email, phone, company, salt], function(err, result){
					done();
					if(err){
						return res.render('error', {error: err})
					}
					res.redirect('/');
					client.query(domainInsert, [1, username, false], function(err, result){
						if(err) console.log('Error running query', err);
						for(var key in defaultSub){
							client.query(subInsert, [defaultSub[key], username, false]);
						}
						done();
					});
				});
			}else{
				done();
				res.redirect('/register');
			}
		});
	});
});

router.post('/login', function(req, res){
	var findSalt = 'SELECT salt FROM users.user WHERE username=$1';
	var validLogin = 'SELECT * FROM users.user WHERE username=$1 and hash=$2';
	var findDomains = 'SELECT name, id from permissions.domain_user NATURAL JOIN domains.domain WHERE username = $1';
	var findsubDomains = 'SELECT name, id from permissions.subdomain_user as perm JOIN domains.subdomain as dom ON(perm.subdomain_id = dom.id) WHERE username = $1';
	pool.connect(function(err, client, done){
		if(err){
			console.log('Error running query', err);
			return res.render('error', {error: err})
		}
		client.query(findSalt, [req.body.username], function(err, result){
			if(err){
				console.log('Error running query', err);
				return res.render('error', {error: err})
			}
			if(result.rows.length !== 0){
				var hash = bcrypt.hashSync(req.body.password, result.rows[0].salt);
				client.query(validLogin, [req.body.username, hash], function(err, result){
					if(result.rows.length != 0){
						
						client.query(findDomains, [req.body.username], function(err, result){

							var domains = result.rows;
							client.query(findsubDomains, [req.body.username], function(err, result){

								done();
								var subs = result.rows;
								req.session[req.body.username] = {nav: domains, subnav: subs};
								res.redirect('/?username=' + req.body.username);
							});
						});

					}
					else
						return res.redirect('/login');
				});
			}else{
				return res.redirect('/login');
			}
			done();
		});
	});
});

router.get('/NYU/:sub/:subid/:user', function(req, res){
	if(! req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
		return;
	}
	var findThreads = 'SELECT subdomain_id, thread.id, author, date_posted, title, context, points, filename from posts.thread JOIN posts.file ON(thread.id = file.thread_id) WHERE subdomain_id = $1 ORDER BY points DESC';
	pool.connect(function(err, client, done){
		client.query(findThreads, [req.params.subid], function(err, result){
			done();
			var user = req.params.user;
			res.render('index', {threads: result.rows, nav: req.session[user].nav, subnav: req.session[user].subnav, user: user, subid: req.params.subid, sub: req.params.sub});
		});
	});
});

// 2 user params: newPassword, username
// successfully updates password w/ new hash
// router.post('/updatePassword', function(req, res){
// 	var updatePassword = 'UPDATE users.user SET password = $1 WHERE username = $2';
// 	var salt =  bcrypt.genSaltSync(10);
// 	var hash = bcrypt.hashSync(req.body.newPassword, salt);
// 	pool.connect(function(err, client, done){
// 		client.query(updatePassword, [hash, req.body.username], function(err, result){
// 			done();
// 			res.json(result.rows);
// 		});
// 	});
// });

router.get('/logout/:user', function(req, res){
	delete req.session[req.params.user];
	res.redirect('/');
});

// Subdomain: Get threads of selected subdomain
router.get('/api/v1.0/NYU/:sub/:subid/:user', function(req, res){ // /api/NYU/CS/3/wz634
	if(!req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
		return;
	}

	var findThreads = 'SELECT subdomain_id, thread.id, author, date_posted, title, context, points, filename from posts.thread JOIN posts.file ON(thread.id = file.thread_id) WHERE subdomain_id = $1 ORDER BY points DESC';
	pool.connect(function(err, client, done){
		client.query(findThreads, [req.params.subid], function(err, result){
			done();
			var user = req.params.user;
			//res.render('index', {threads: result.rows, nav: req.session[user].nav, subnav: req.session[user].subnav, user: user, subid: req.params.subid, sub: req.params.sub});
			res.json();
			return;
		});
	});
	res.json(false);
});

// Subdomain: Create subdomain
router.post('api/v1.0/NYU/:user/createSub', function(req, res){
	if(!req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
		return;
	}
	var createSub = 'INSERT INTO domains.subdomain (name, domain_id) VALUES($1, 1) RETURNING id';
	var userSub = 'INSERT INTO permissions.subdomain_user VALUES($1, $2, true)';
	var findsubDomains = 'SELECT name, id from permissions.subdomain_user as perm JOIN domains.subdomain as dom ON(perm.subdomain_id = dom.id) WHERE username = $1';
	
	pool.connect(function(err, client, done){
		client.query(createSub, [req.body.subName], function(err, result){
			client.query(userSub, [result.rows[0].id, req.params.user], function(err, result){
				client.query(findsubDomains, [req.params.user], function(err, result){
					done();
					//req.session[req.params.user].subnav = result.rows;
					//res.redirect('/?username=' + req.params.user);
					res.json(true);
					return;
				})
			});
		})
	});

	res.json(false);
});

// Subdomain: Join subdomain
router.post('api/v1.0/NYU/joinSub/:subid/:user', function(req, res){
	var insertSub = 'insert into permissions.subdomain_user values($1, $2, false);';
	var findsubDomains = 'SELECT name, id from permissions.subdomain_user as perm JOIN domains.subdomain as dom ON(perm.subdomain_id = dom.id) WHERE username = $1';
	pool.connect(function(err, client, done){
		client.query(insertSub, [req.params.subid, req.params.user], function(err, result){
			client.query(findsubDomains, [req.params.user], function(err, result){
				done();
				req.session[req.params.user].subnav = result.rows;
				res.redirect('/?username=' + req.params.user);
			});
		});
	});
});

// Thread: Create thread
router.post('/NYU/:sub/:subid/:user/createThread', upload.single('file'), function(req, res){
	if(! req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
		return;
	}
	var createThread;
	pool.connect(function(err, client, done){
		if (!req.file) { // no file
			createThread = 'WITH created_thread_id AS (INSERT INTO posts.thread(subdomain_id, title, author, context) VALUES($1, $2, $3, $4) RETURNING id) INSERT INTO posts.file(thread_id) SELECT id FROM created_thread_id';

			client.query(createThread, [req.params.subid, req.body.title, req.params.user, req.body.context], function(err, result){
				if (err) console.log(err);
				
				done();
				res.redirect('/NYU/' + req.params.sub + '/' + req.params.subid + '/' + req.params.user);
			});
		}
		else { // there is file
			if (err) console.log(err);
			createThread = 'WITH created_thread_id AS ' + 
			'(INSERT INTO posts.thread(subdomain_id, title, author, context) ' + 
			'VALUES($1, $2, $3, $4) ' + 'RETURNING id) ' + 
			'INSERT INTO posts.file(thread_id, filename, data) ' + 
			'SELECT id, $5, pg_read_binary_file($6)::bytea ' + 
			'FROM created_thread_id';
			
			client.query(createThread, [req.params.subid, req.body.title, req.params.user, req.body.context, req.file.originalname, req.file.filename], function(err, result){
				if (err) console.log(err);
					
				done();
				res.redirect('/NYU/' + req.params.sub + '/' + req.params.subid + '/' + req.params.user);
			});
		}
	});
});

// Thread: Get info about selected thread
router.get('/NYU/:sub/:subid/:user/:thread_id', function(req, res){
	if(! req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
		return;
	}
	var user = req.params.user;
	var threads = 'SELECT * FROM posts.thread WHERE id = $1';
	var comments = 'SELECT * FROM posts.comment WHERE thread_id=$1 ORDER BY points DESC, date_posted DESC';
	var file = 'SELECT filename FROM posts.thread JOIN posts.file ON(thread.id = file.thread_id) WHERE thread_id = $1';

	pool.connect(function(err, client, done){
		client.query(threads, [req.params.thread_id], function(err, thread){
			client.query(comments, [req.params.thread_id], function(err, comments){
				client.query(file, [req.params.thread_id], function(err, filename){
					//res.render('threadContent', {thread: thread.rows[0], comments: comments.rows, filename: filename.rows[0], nav: req.session[user].nav, subnav: req.session[user].subnav, user: user, subid: req.params.subid, sub: req.params.sub, thread_id: req.params.thread_id})
					res.json();
				});	
			});
		});
	});
});

// Thread: Vote thread
router.post('/voteThread/:user/:thread_id/:rating', function(req, res){
	if(! req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
		return;
	}
	var voteThread = 'INSERT INTO ratings."ThreadRating"(thread_id, username, rating) VALUES($1, $2, $3)';
	var queryFind = 'SELECT username FROM ratings."ThreadRating" WHERE thread_id = $1 and username = $2';
	var updateVote = 'UPDATE ratings."ThreadRating" SET rating = $3 WHERE thread_id = $1 and username = $2';
	var findPoints = 'SELECT points FROM posts.thread WHERE id = $1';

	pool.connect(function(err, client, done){
		client.query(queryFind, [req.params.thread_id, req.params.user], function(err, result){
			if (result.rows.length === 0) { // user rating not found, so insert new rating
				client.query(voteThread, [req.params.thread_id, req.params.user, req.params.rating], function(err, result){
					getPoints(client, req.params.thread_id, res, done, findPoints);
				});
			}
			else {
				client.query(updateVote, [req.params.thread_id, req.params.user, req.params.rating], function(err, result){
					getPoints(client, req.params.thread_id, res, done, findPoints);
				});
			}
			done();
		});
	});
});

// Comment: Create comment
router.post('api/v1.0/NYU/:sub/:subid/:user/:thread_id', function(req, res){ //
	if(! req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
		return;
	}
	var createComment = 'INSERT into posts.comment(thread_id, author, comment) values($1, $2, $3)';
	pool.connect(function(err, client, done){
		client.query(createComment, [req.params.thread_id, req.params.user, req.body.comment], function(err, result){
			done();
			res.redirect('/NYU/' + req.params.sub + '/' + req.params.subid + '/' + req.params.user + '/' + req.params.thread_id);
		});
	});
});


// Comment: Get rating
router.post('api/v1.0/NYU/voteComment/:user/:comment_id/:rating', function(req, res){
	if(! req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
		return;
	}
	var voteComment = 'INSERT INTO ratings."CommentRating"(comment_id, username, rating) VALUES($1, $2, $3)';
	var queryFind = 'SELECT username FROM ratings."CommentRating" WHERE comment_id = $1 and username = $2';
	var updateVote = 'UPDATE ratings."CommentRating" SET rating = $3 WHERE comment_id = $1 and username = $2';
	var findPoints = 'SELECT points FROM posts.comment WHERE id = $1';

	pool.connect(function(err, client, done){
		client.query(queryFind, [req.params.comment_id, req.params.user], function(err, result){
			if (result.rows.length === 0) { // user rating not found, so insert new rating
				client.query(voteComment, [req.params.comment_id, req.params.user, req.params.rating], function(err, result){
					getPoints(client, req.params.comment_id, res, done, findPoints);
				});
			}
			else {
				client.query(updateVote, [req.params.comment_id, req.params.user, req.params.rating], function(err, result){
					getPoints(client, req.params.comment_id, res, done, findPoints);
				});
			}
			done();
		});
	});
});

module.exports = router;