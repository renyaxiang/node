const qs = require('querystring');
const axios = require('axios');
const config = require('../config');
const conn = require('../common/mysql');

exports.getUserinfoByCode = async code => {
    const result = await axios({
        method: 'get',
        url: 'https://github.com/login/oauth/access_token',
        params: {
            client_id: config.github_client_id,
            client_secret: config.github_client_secret,
            code: code
        }
    });
    const accessToken = qs.parse(result.data).access_token;
    const { data } = await axios({
        method: 'get',
        url: 'https://api.github.com/user',
        params: {
            access_token: accessToken
        }
    });
    return {
        nickname: data.nickname,
        email: data.email,
        avatar: data.avatar_url,
        intro: data.bio
    };
};

exports.addUser = ({ nickname, avatar, email, intro }) => {
    const sql =
        'insert into users(pid, nickname, avatar, email, intro) values(?, ?, ?, ?, ?)';
    const pid = uuidv4();
    const sqlParams = [pid, nickname, avatar, email, intro];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, err => {
            if (err) return reject(err);
            resolve(pid);
        });
    });
};

/**
 * 每次免登授权时同步github账号信息
 * @param {String} githubId
 * @param {String} githubUserName
 * @param {String} githubAccessToken
 * @returns {Promise}
 */
exports.syncGithub = function(githubId, githubUserName, githubAccessToken) {
    const sql =
        'update users set githubUserName = ?, githubAccessToken = ? where githubId = ?';
    const sqlParams = [githubUserName, githubAccessToken, githubId];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) return reject(err);
            resolve(datas);
        });
    });
};

/**
 * 根据githubId查看用户信息
 * @param {String} githubId
 * @returns {Promise}
 */
exports.getUserDetailByGithubId = function(githubId) {
    const sql = 'select  pid, nickname, status from users where githubId = ?';
    const sqlParams = [githubId];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if (err) return reject(err);
            resolve(datas[0]);
        });
    });
};

/**
 * 通过code去拿令牌access-token
 * @private
 * @param {String} code 地址栏返回的授权码
 * @returns {Promise}
 */
function fetchToken(code) {
    return axios({
        method: 'get',
        url: 'https://github.com/login/oauth/access_token',
        params: {
            client_id: config.github_client_id,
            client_secret: config.github_client_secret,
            code: code
        }
    }).then(result => {
        return qs.parse(result.data).access_token;
    });
}

/**
 * 根据令牌accessToken，去获取github中的用户信息
 * @private
 * @param {string} accessToken 令牌
 * @returns {Promise}
 */
function getUserInfo(accessToken) {
    return axios({
        method: 'get',
        url: 'https://api.github.com/user',
        params: {
            access_token: accessToken
        }
    }).then(result => {
        result.data.accessToken = accessToken;
        return result.data;
    });
}
