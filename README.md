# Distributed Sharit
Sharit Website still running @ http://sharit.warloncs.net

Website will get updated over the semester.

* Google drive Link
 * https://drive.google.com/open?id=0B8SEHfpAjaYCYXlfWkdCUWZxZGc

## Overview
Distributed Sharit follows a new roadmap architecture to secure no single point of failure in the distributed system. Currently, there are plans to expand nginx webservers, frontend webservers, REST API endpoints, caching using memcached, databases using redis or apache cassandra, and filesystem using hadoop file system, amazon S3, or CDN of a sort. 

Android development will come soon.

- - - -

# Project Sharit
## Overview
Sharit is a website developed to share information between users of established organizations. Main features supported are file sharing with threads, comments for users to communicate with one another. This website is built on NodeJS for front and back end, postgreSQL for db, and templating + jQuery bootstrapping for frontend responsiveness.

## Technologies Involved
* NodeJS
* PostgreSQL
* HTML5
* CSS3

## Usage
User will sign in (sign up if haven't done so), look for a thread, and comment on a thread. Users could also create a thread and upvote or downvote other user's comments. 
Files will be shared through threads.

## How to Install and Run
### Installing NodeJS
On Ubuntu 16.04 LTS, download NodeJS and npm. Commands to do so:
```git
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
```
To update node:
```git
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
sudo n latest
```

### Installing and Running PostgreSQL
Download PostgreSQL with the following commands:
```git
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```
Change user "postgres" password to "root"
```git
sudo -u postgres psql
\password postgres \\ confirm "root"
\q
```
Create initial empty sharit database:
```git
sudo psql -h 'localhost' -p 5432 -U postgres -c "CREATE DATABASE sharit"
OR
CREATE DATABASE sharit;
```
Verify sharit database has been created (if anything goes wrong, can do "DROP DATABASE sharit;" on psql cli:
```git
sudo -u postgres psql
\l \\ show databases under user "postgres"
\q
```
Restore sharit.backup database into initial empty sharit we created earlier (watch for path):
```git
sudo pg_restore --host 'localhost' --port 5432 --username "postgres" --dbname "sharit" --clean "/home/ubuntu/GitHub/Sharit/database/sharit.backup"
```
The PostgreSQL should be running, but if it is not or unexpectedly dies, PostgreSQL service can be restarted:
```git
sudo service postgresql restart
```

### Running NodeJS and PM2
Browse to /Sharit/src and get all npm dependencies:
```git
sudo npm install
```
Run the server directly by the following command:
```git
node bin/www
```
The server can be automatically restarted upon crash with a production manager module, pm2. Install pm2 by:
```git
sudo npm install pm2 -g
```
And run with:
```git
pm2 start ./bin/www
```
To kill process:
```git
pm2 stop www
```
To delete process from PM2:
```git
pm2 delete www
```

### Using PostgreSQL on CLI
```git
sudo -u postgres psql
\l \\ show databases
\q \\ quit
\c sharit \\ use this database
DROP DATABASE sharit; \\ perform the SQL.
CREATE DATABASE sharit; \\ perform the SQL.
SELECT * FROM users.user; \\ show members id, pass(hashed), etc.
```

### Nginx Configuration:
To install nginx:
```git
sudo apt-get update
sudo apt-get install nginx
sudo ufw allow 'Nginx HTTP'
```
To update nginx (using our nginx.conf file):
```git
cd /etc/nginx
sudo vi nginx.conf \\ manually
```
or:
```git
sudo cp -f /home/ubuntu/GitHub/Sharit/nginx/nginx.conf /etc/nginx
```
To check run/restart/status/stop nginx:
```git
sudo service start nginx
sudo service restart nginx
sudo service stop nginx
sudo service status nginx
```
To check for debug errors running nginx server (due to misconfiguration):
```git
sudo nginx -t -c /etc/nginx/nginx.conf
```

### Git Protocols:
To replace all your local files (including edits) with remote repo:
```git
git fetch origin
git reset --hard origin/master
git clean -f -d
```
To get the latest code updates:
```git
git pull
```
To push all your local files (if merge conflict commit first then pull and push):
```git
git add .
git commit -a
git push origin master
```
To replace all the remote files using your local files:
```git
git push -f origin master
```
