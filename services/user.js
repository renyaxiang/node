/**
 * @author xiangry <xiangrenya@gmail.com>
 * @createDate 2017-12-06
 * @updateDate 2018-01-16
 * 已实现功能列表
    - 用户注册
    - 用户登录
    - 判断用户名是否存在
    - 判断用户密码是否正确
    - 获取用户基本信息
    - 更新用户基本信息
    - 修改密码
    - 注销用户
    - 用户状态管理
    - 用户列表（带分页，模糊查询）
    - 统计用户数量
 */


const conn = require('../common/mysql');
const uuidv4 = require('uuid/v4');
const utils = require('../common/utils');

/**
 * 用户注册
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {String} email 邮箱
 * @returns {Promise}
 */
exports.registerUser = function (username, password, email) {
    const sql = 'insert into users(pid, username, password, nickname, email) values(?, ?, ?, ?, ?)'
    const pid = uuidv4()
    const sqlParams = [pid, username, utils.cryptoPassword(password), username, email]
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) {
                reject(err)
            } else {
                const user = {
                    pid,
                    username
                }
                resolve(user)
            }
        })
    })
}

/**
 * 获取用户基本信息
 * @param {String} userId 用户id
 * @returns {Promise} 用户信息
 */
exports.getUserDetail = function (userId) {
    const sql = 'select  username, nickname, githubUserName, mobile, email, intro, avatarUrl, status from users where pid = ?'
    const sqlParams = [userId]
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) {
                reject(err)
            } else {
                resolve(datas[0])
            }
        });
    })
}

/**
 * 更改用户基本信息
 * @param {String} userId 用户id
 * @param {String} nickname 昵称
 * @param {String} mobile 手机号
 * @param {String} email 邮箱
 * @param {String} intro 自我介绍
 * @param {String} avatarUrl 头像地址
 * @returns {Promise}
 */
exports.updateUser = function (userId, nickname, mobile, email, intro, avatarUrl) {
    const sql = 'update users set nickname = ?, mobile = ?, email = ?, intro = ?, avatarUrl = ? where pid = ?';
    const sqlParams = [nickname, mobile, email, profile, avatarUrl, userId];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if(err){
                reject(err)
            }else{
                resolve(datas)
            }
        })
    })
}

/**
 * 判断用户密码是否正确
 * @param {String} userId 用户id
 * @param {String} password 密码
 * @returns {Promise}
 */
exports.validatePassword = function (userId, password) {
    const sql = 'select * from users where pid = ? and password = ?'
    const sqlParams = [userId, utils.cryptoPassword(password)]
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if(err){
                reject(err)
            }else{
                resolve(datas.length == 1)
            }
        })
    })
};
/**
 * 更改用户密码
 * @param {String} userId 用户id
 * @param {String} newPassword 新密码
 * @param {Promise}
 */
exports.changeUserPassword = function (userId, newPassword) {
    const sql = 'update users set password = ? where pid = ?'
    const sqlParams = [utils.cryptoPassword(newPassword), userId]
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if(err){
                reject(err)
            }else{
                resolve(datas)
            }
        })
    })
}

/**
 * 判断用户名是否存在
 * @param {String} username 用户名
 * @returns {Promise}
 */
exports.validateUserName = function (username) {
    const sql = 'select * from users where username = ?'
    const sqlParams = [username]
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if(err){
                reject(err)
            }else{
                resolve(datas.length > 0)
            }
        })
    })
}

/**
 * 用户登录
 * @param {String} username 用户名
 * @param {String} password 密码
 * @returns {Promise}
 */
exports.userLogin = function (username, password) {
    const sql = 'select * from users where username = ? and password = ?'
    const sqlParams = [username, utils.cryptoPassword(password)]
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if(err){
                reject(err)
            }else{
                resolve(datas[0])
            }
        })
    })
}

/**
 * 用户状态管理
 * @param {String} userId 用户id
 * @param {number} status 用户状态 0:禁用 1:普通用户 2:管理员
 * @returns {Promise}
 */
exports.changeUserStatus = function (userId, status) {
    const sql = 'update users set status = ? where pid = ?'
    const sqlParams = [status, userId]
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if(err){
                reject(err)
            }else{
                resolve(datas)
            }
        })
    })
}

/**
 * 注销用户
 * @param {String} userId - 用户id
 * @returns {Promise}
 */
exports.deleteUser = function (userId) {
    const sql = 'delete from users where pid = ?'
    const sqlParams = [userId]
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if(err){
                reject(err)
            }else{
                resolve(datas)
            }
        })
    })  
}

/**
 * 用户列表（分页、模糊查询）
 * @param {number} page 第几页
 * @param {number} limit 每页显示的数量
 * @param {String} username 用户名
 * @param {Promise} 用户列表
 */
exports.getUserList = function (page, perPage, username) {
    let sql = 'select pid, username, nickname, mobile, email, intro, avatarUrl, status from users where 1 = 1 '
    let sqlParams = [(page - 1) * perPage, perPage]

    if(username){
        sql += 'and username like ? '
        sqlParams.unshift('%' + username + '%')
    }
    sql += 'order by createDate desc limit ?, ?'

    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) {
                reject(err)
            } else {
                resolve(datas)
            }
        })
    })
}
/**
 * 统计用户数量
 * @param {String} username 用户名
 * @returns {Promise} 统计用户数量
 */
exports.countUsers = function (username) {
    let sql = 'select count(pid) as count from users '
    let sqlParams = []
    if(username){
        sql += 'where username like ?'
        sqlParams.push('%' + username + '%')
    }

    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) {
                reject(err)
            } else {
                resolve(datas[0].count)
            }
        })
    })
}

