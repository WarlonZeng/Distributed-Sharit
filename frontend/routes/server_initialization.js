var mysql = require('mysql');
var configDB = require('../config/dbconfig.js');
var pool = new mysql.createPool(configDB);

var DEFAULT_NAV = new Promise(function(resolve, reject) {

    var FIND_ALL_DOMAINS = 'SELECT domain_name, domain_id FROM domain';
    var FIND_ALL_SUBDOMAINS = 'SELECT domain_name, subdomain_name, subdomain_id FROM subdomain NATURAL JOIN domain'

    pool.getConnection(function(err, client, done) {
        client.query(FIND_ALL_DOMAINS, [], function(err, ALL_DOMAINS) {
            client.query(FIND_ALL_SUBDOMAINS, [], function(err, ALL_SUBDOMAINS) {
            	client.release();
                resolve({ALL_DOMAINS, ALL_SUBDOMAINS});
            });
        });
    });
});

module.exports = DEFAULT_NAV;