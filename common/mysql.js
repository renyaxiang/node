
const mysql = require('mysql');
const config = require('../config');

const conn = mysql.createConnection({
    host: config.mysql_host,
    port: config.mysql_port,
    user: config.mysql_user,
    password: config.mysql_password,
    database: config.mysql_db
});
conn.connect(err => {
    if (err) return console.error(err);
    console.info(
        'mysql connected successfully. host: %s, post: %s, thread: %s',
        config.mysql_host,
        config.mysql_port,
        conn.threadId
    );
});

function query(sql, sqlParams) {
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}
module.exports = conn;
