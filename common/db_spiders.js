var mysql = require('mysql');
var config = require('../config');
var logger = require('./log');

var connection = mysql.createConnection({
    host: config.mysql_host,
    port: config.mysql_port,
    user: config.mysql_user,
    password: config.mysql_password, 
    database: config.mysql_db_spiders
})
connection.connect(function (err) {
    if (err) {
        logger.error(err);
    } else {
        logger.info('connected as id ' + connection.threadId);
    }
});

module.exports = connection;