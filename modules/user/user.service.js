const conn = require('../../common/mysql');
const uuidv4 = require('uuid/v4');
const utils = require('../../common/utils');

exports.signup = function(username, password, email) {
    const sql =
        'insert into user(id, username, password, nickname, email) values(?, ?, ?, ?, ?)';
    const id = uuidv4();
    const sqlParams = [
        id,
        username,
        utils.cryptoPassword(password),
        username,
        email
    ];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, err => {
            if (err) reject(err);
            resolve(id);
        });
    });
};

exports.login = function(username, password) {
    const sql = 'select * from user where username = ? and password = ?';
    const sqlParams = [username, utils.cryptoPassword(password)];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data[0]);
        });
    });
};

exports.list = function(page = 1, perPage = 10, username = '') {
    if (typeof page === 'string') {
        page = parseInt(page);
    }
    if (typeof perPage === 'string') {
        perPage = parseInt(perPage);
    }
    let sql =
        'select id, username, nickname, mobile, email, intro, avatar_url, role from user where 1 = 1 ';
    let sqlParams = [];
    if (username) {
        sql += 'and username like ? ';
        sqlParams.push('%' + username + '%');
    }
    sql += 'order by create_time desc limit ?, ?';
    sqlParams.push((page - 1) * perPage, perPage);
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

exports.count = function(username) {
    let sql = 'select count(id) as count from user ';
    let sqlParams = [];
    if (username) {
        sql += 'where username like ?';
        sqlParams.push('%' + username + '%');
    }
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data[0].count);
        });
    });
};

exports.get = function(id) {
    const sql = 'select * from user where id = ?';
    const sqlParams = [id];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            if (data[0]) {
                delete data[0].password;
            }
            resolve(data[0]);
        });
    });
};

exports.update = function(user) {
    let sql = 'update user set %s where id = ?';
    const fields = [];
    const sqlParams = [];
    const { id, ...rest } = user;
    for (let [key, val] of Object.entries(rest)) {
        fields.push(`${key} = ?`);
        sqlParams.push(val);
    }
    sqlParams.push(id);
    sql = sql.replace('%s', fields.join(', '));
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

exports.delete = function(id) {
    const sql = 'delete from user where id = ?';
    const sqlParams = [id];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve();
        });
    });
};

exports.changePassword = function(id, newPassword) {
    const sql = 'update user set password = ? where id = ?';
    const sqlParams = [utils.cryptoPassword(newPassword), id];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

exports.changeStatus = function(id, status) {
    const sql = 'update user set status = ? where id = ?';
    const sqlParams = [status, id];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

exports.isValidPassword = function(id, password) {
    const sql = 'select * from user where id = ? and password = ?';
    const sqlParams = [id, utils.cryptoPassword(password)];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data.length == 1);
        });
    });
};

exports.isValidUserName = function(username) {
    const sql = 'select * from user where username = ?';
    const sqlParams = [username];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data.length > 0);
        });
    });
};
