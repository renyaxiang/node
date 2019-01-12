/**
 * github授权过程
 * https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
 */

const qs = require('querystring');
const axios = require('axios');
const uuidv4 = require('uuid/v4');
const config = require('../config');
const conn = require('../common/mysql');

exports.getAuthorizationUrl = () => {
    const query = {
        client_id: config.client_id,
        scope: config.scope.join(' ')
    };
    qs.stringify(query);
    return `https://github.com/login/oauth/authorize?${qs.stringify(query)}`;
};

exports.getGithubInfoByCode = async code => {
    const { access_token } = await axios({
        method: 'get',
        url: 'https://github.com/login/oauth/access_token',
        params: {
            client_id: config.github_client_id,
            client_secret: config.github_client_secret,
            code: code
        }
    });
    const githubInfo = await axios({
        method: 'get',
        url: 'https://api.github.com/user',
        params: {
            access_token
        }
    });
    return githubInfo;
};

exports.getUser = nickname => {
    const sql = 'select * from users where nickname = ?';
    const sqlParams = [nickname];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data[0] && data[0].pid);
        });
    });
};

exports.addUser = ({ nickname, avatar, email, intro }) => {
    const sql =
        "insert into users(pid, nickname, avatar, email, intro, role) values(?, ?, ?, ?, ?, 'github')";
    const sqlParams = [uuidv4(), nickname, avatar, email, intro];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, err => {
            if (err) return reject(err);
            resolve(pid);
        });
    });
};

exports.updateUser = ({ nickname, avatar, email, intro }) => {
    const sql =
        "update users set avatar = ?, email = ?, intro = ? where role = 'github' and nickname = ?";
    const sqlParams = [avatar, email, intro, nickname];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, err => {
            if (err) return reject(err);
            resolve();
        });
    });
};
