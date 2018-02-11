/**
 * @author xiangry <xiangrenya@gmail.com>
 * @description 工具类
    - 密码加密
    - 创建token
    - 验证token
    - 规范化对象
 */

const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../config')

/**
 * 用md5算法加密password
 * @param {String} password 明文密码
 * @returns {String} md5加密后的密码
 */

exports.cryptoPassword = function (password) {
    const hash = crypto.createHash('md5')
    hash.update(password)
    return hash.digest('hex')
}

/**
 * 创建token
 * @param {Object} payload - 载荷信息 
 * @returns {String} - jsonwebtoken
 */
exports.signToken = function (payload) {
    const token = jwt.sign({
        payload: payload
    }, config.jwt_secret)
    return token
}

/**
 * 验证token
 * @param {String} token - 令牌 
 * @returns {Promise}
 */
exports.validateToken = function (token, cb) {
    return new Promise((resolve,reject) => {
        jwt.verify(token, config.jwt_secret, (err, decoded) => {
            if(err) reject(err)
            resolve(decoded.payload)
        })
    })
}

/**
 * 规范化对象，截取值的前后空格
 * @param {Object} obj 对象类型
 * @return {Object} obj 规范化的对象
 */
exports.normalizeObj = function (obj) {
    for(let key in obj){
        obj[key] = obj[key] && obj[key].trim()
    }
    return obj
}