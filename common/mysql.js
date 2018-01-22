/**
 * @author xiangry <xiangrenya@gmail.com>
 */

const mysql = require('mysql')
const config = require('../config')

const conn = mysql.createConnection({
    host: config.mysql_host,
    port: config.mysql_port,
    user: config.mysql_user,
    password: config.mysql_password, 
    database: config.mysql_db
})
conn.connect(function (err) {
    if (err) {
        console.error(err)
    } else {
    host: config.mysql_host,
        console.info('mysql connected successfully. host: %s, post: %s, thread: %s', config.mysql_host, config.mysql_port, conn.threadId)
    }
})

module.exports = conn