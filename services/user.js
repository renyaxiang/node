/**
 * @author xiangry <xiangrenya@gmail.com>
 * @description 用户服务
    - 创建时间 2017-12-06
    - 更新时间 2018-02-11
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


const conn = require('../common/mysql')
const uuidv4 = require('uuid/v4')
const utils = require('../common/utils')

/**
 * 用户注册
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {String} email 邮箱
 * @returns {Promise}
 */
exports.signup = function (username, password, email) {
    const sql = 'insert into users(pid, username, password, nickname, email) values(?, ?, ?, ?, ?)'
    const pid = uuidv4()
    const sqlParams = [pid, username, utils.cryptoPassword(password), username, email]
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err) => {
            if (err) reject(err)
            const user = {
                pid,
                username
            }
            resolve(user)
        })
    })
}

/**
 * 获取用户基本信息
 * @param {String} id 用户id
 * @returns {Promise} 用户信息
 */
exports.getOne = function (id) {
    const sql = 'select  username, nickname, githubUserName, mobile, email, intro, avatar, status from users where pid = ?'
    const sqlParams = [id]
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) reject(err)
            resolve(datas[0])
        })
    })
}

/**
 * 更改用户基本信息
 * @description 所有修改字段可以为空
 * @param {String} id 用户id
 * @param {String} nickname 昵称
 * @param {String} mobile 手机号
 * @param {String} email 邮箱
 * @param {String} intro 自我介绍
 * @param {String} avatar 头像地址
 * @returns {Promise}
 */
exports.update = function (id, nickname, mobile, email, intro, avatar) {
    let sql = 'update users set %s where pid = ?'
    const fileds = []
    const sqlParams = []
    if(nickname !== undefined){
        fileds.push('nickname = ?')
        sqlParams.push(nickname)
    }
    if(mobile !== undefined){
        fileds.push('mobile = ?')
        sqlParams.push(mobile)
    }
    if(email !== undefined){
        fileds.push('email = ?')
        sqlParams.push(email)
    }
    if(intro !== undefined){
        fileds.push('intro = ?')
        sqlParams.push(intro)        
    }
    if(avatar !== undefined){
        fileds.push('avatar = ?')
        sqlParams.push(avatar)
    }
    sqlParams.push(id)
    sql = sql.replace('%s', fileds.join(', '))
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) reject(err)
            resolve(datas)
        })
    })
}

/**
 * 判断用户密码是否正确
 * @param {String} id 用户id
 * @param {String} password 密码
 * @returns {Promise}
 */
exports.isValidPassword = function (id, password) {
    const sql = 'select * from users where pid = ? and password = ?'
    const sqlParams = [id, utils.cryptoPassword(password)]
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) reject(err)
            resolve(datas.length == 1)            
        })
    })
}
/**
 * 更改用户密码
 * @param {String} id 用户id
 * @param {String} newPassword 新密码
 * @param {Promise}
 */
exports.resetPassword = function (id, newPassword) {
    const sql = 'update users set password = ? where pid = ?'
    const sqlParams = [utils.cryptoPassword(newPassword), id]
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) reject(err)
            resolve(datas)
        })
    })
}

/**
 * 判断用户名是否存在
 * @param {String} username 用户名
 * @returns {Promise}
 */
exports.isValidUserName = function (username) {
    const sql = 'select * from users where username = ?'
    const sqlParams = [username]
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) reject(err)
            resolve(datas.length > 0)
        })
    })
}

/**
 * 用户登录
 * @param {String} username 用户名
 * @param {String} password 密码
 * @returns {Promise}
 */
exports.login = function (username, password) {
    const sql = 'select * from users where username = ? and password = ?'
    const sqlParams = [username, utils.cryptoPassword(password)]
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) reject(err)
            resolve(datas[0])
        })
    })
}

/**
 * 用户状态管理
 * @param {String} id 用户id
 * @param {number} status 用户状态 0:禁用 1:普通用户 2:管理员
 * @returns {Promise}
 */
exports.changeStatus = function (id, status) {
    const sql = 'update users set status = ? where pid = ?'
    const sqlParams = [status, id]
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) reject(err)
            resolve(datas)
        })
    })
}

/**
 * 注销用户
 * @param {String} id - 用户id
 * @returns {Promise}
 */
exports.delete = function (id) {
    const sql = 'delete from users where pid = ?'
    const sqlParams = [id]
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) reject(err)
            resolve()
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
exports.getList = function (page, perPage, username) {
    let sql = 'select pid, username, nickname, mobile, email, intro, avatar, status from users where 1 = 1 '
    let sqlParams = [(page - 1) * perPage, perPage]

    if (username) {
        sql += 'and username like ? '
        sqlParams.unshift('%' + username + '%')
    }
    sql += 'order by createDate desc limit ?, ?'

    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) reject(err)
            resolve(datas)
        })
    })
}
/**
 * 统计用户数量
 * @param {String} username 用户名
 * @returns {Promise} 统计用户数量
 */
exports.count = function (username) {
    let sql = 'select count(pid) as count from users '
    let sqlParams = []
    if (username) {
        sql += 'where username like ?'
        sqlParams.push('%' + username + '%')
    }
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) reject(err)
            resolve(datas[0].count)
        })
    })
}

