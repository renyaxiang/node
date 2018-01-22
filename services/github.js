/**
 * @author xiangry <xiangrenya@gmail.com>
 * @description github授权过程
 *  - 授权读取用户信息
    - 添加github账号信息至用户表
    - 同步github账号信息
    - 通过githubId查看用户信息
 */
const qs = require('querystring')
const axios = require('axios')
const config = require('../config')
const conn = require('../common/mysql')

/**
 * 通过授权码去换令牌，再通过令牌去读取用户信息
 * @param {String} code 授权码
 * @returns {Promise}
 */
exports.auth = function (code) {
  return new Promise((resolve, reject) => {
    getAccessToken(code).then(accessToken => {
      getUserData(accessToken).then(user => {
        resolve({
          id: user.id,
          userName: user.login,
          accessToken: accessToken,
          email: user.email,
          avatarUrl: user.avatar_url,
          intro: user.bio
        })
      }).catch((err) => {
        reject(err)
      })
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * 通过github授权登录
 * @param {String} githubId
 * @param {String} githubUserName
 * @param {String} githubAccessToken
 * @returns {Promise}
 */
exports.registerByGithub = function (githubId, githubUserName, githubAccessToken, githubAvatarUrl, githubEmail, githubIntro) {
  const sql = 'insert into users(pid, githubId, githubUserName, userName, nickName, githubAccessToken, avatarUrl, email, intro) values(?, ?, ?, ?, ?, ?, ?, ?, ?)'
  const sqlParams = [uuidv4(), githubId, githubUserName, githubUserName, githubUserName, githubAccessToken, githubAvatarUrl, githubEmail, githubIntro]
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
* 每次免登授权时同步github账号信息
* @param {String} githubId 
* @param {String} githubUserName 
* @param {String} githubAccessToken
* @returns {Promise}
*/
exports.syncGithub = function (githubId, githubUserName, githubAccessToken) {
  const sql = 'update users set githubUserName = ?, githubAccessToken = ? where githubId = ?'
  const sqlParams = [githubUserName, githubAccessToken, githubId]
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
 * 根据githubId查看用户信息
 * @param {String} githubId 
 * @returns {Promise}
 */
exports.getUserDetailByGithubId = function (githubId) {
  const sql = 'select  pid, nickname, status from users where githubId = ?'
  const sqlParams = [githubId]
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
 * 通过code去拿令牌access-token
 * @private
 * @param {String} code 地址栏返回的授权码
 * @returns {Promise}
 */
function getAccessToken(code) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: 'https://github.com/login/oauth/access_token',
      params: {
        client_id: config.github_client_id,
        client_secret: config.github_client_secret,
        code: code
      }
    }).then((result) => {
      resolve(qs.parse(result.data).access_token)
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * 根据令牌accessToken，去获取github中的用户信息
 * @private
 * @param {string} accessToken 令牌
 * @returns {Promise}
 */
function getUserData(accessToken) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: 'https://api.github.com/user',
      params: {
        access_token: accessToken
      }
    }).then((result) => {
      resolve(result.data)
    }).catch((err) => {
      reject(err)
    })
  })
}