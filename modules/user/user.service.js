const conn = require('../../common/mysql');
const uuidv4 = require('uuid/v4');
const utils = require('../../common/utils');

exports.signup = function(username, password, email) {
    const sql =
        'insert into users(pid, username, password, nickname, email) values(?, ?, ?, ?, ?)';
    const pid = uuidv4();
    const sqlParams = [
        pid,
        username,
        utils.cryptoPassword(password),
        username,
        email
    ];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, err => {
            if (err) reject(err);
            const user = {
                pid,
                username
            };
            resolve(user);
        });
    });
};

exports.login = function(username, password) {
    const sql = 'select * from users where username = ? and password = ?';
    const sqlParams = [username, utils.cryptoPassword(password)];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) reject(err);
            resolve(datas[0]);
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
        'select pid, username, nickname, mobile, email, intro, avatar, status from users where 1 = 1 ';
    let sqlParams = [];
    if (username) {
        sql += 'and username like ? ';
        sqlParams.push('%' + username + '%');
    }
    sql += 'order by createDate desc limit ?, ?';
    sqlParams.push((page - 1) * perPage, perPage);
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

exports.count = function(username) {
    let sql = 'select count(pid) as count from users ';
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
    const sql =
        'select  username, nickname, githubUserName, mobile, email, intro, avatar, status from users where pid = ?';
    const sqlParams = [id];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data[0]);
        });
    });
};

exports.update = function(id, nickname, mobile, email, intro, avatar) {
    let sql = 'update users set %s where pid = ?';
    const fileds = [];
    const sqlParams = [][(nickname, mobile, email, intro, avatar)].forEach(
        field => {
            if (field) {
                fileds.push(`${field} = ?`);
                sqlParams.push(field);
            }
        }
    );
    sqlParams.push(id);
    sql = sql.replace('%s', fileds.join(', '));
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

exports.delete = function(id) {
    const sql = 'delete from users where pid = ?';
    const sqlParams = [id];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve();
        });
    });
};

exports.changePassword = function(id, newPassword) {
    const sql = 'update users set password = ? where pid = ?';
    const sqlParams = [utils.cryptoPassword(newPassword), id];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

exports.changeStatus = function(id, status) {
    const sql = 'update users set status = ? where pid = ?';
    const sqlParams = [status, id];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

exports.isValidPassword = function(id, password) {
    const sql = 'select * from users where pid = ? and password = ?';
    const sqlParams = [id, utils.cryptoPassword(password)];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data.length == 1);
        });
    });
};

exports.isValidUserName = function(username) {
    const sql = 'select * from users where username = ?';
    const sqlParams = [username];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data.length > 0);
        });
    });
};
