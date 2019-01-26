/**
 * github授权过程
 * https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
 */

const qs = require('querystring');
const axios = require('axios');
const uuidv4 = require('uuid/v4');
const config = require('../../config');
const conn = require('../../common/mysql');

exports.getAuthorizationUrl = () => {
    const query = {
        client_id: config.github_client_id,
        scope: config.scope.join(' ')
    };
    qs.stringify(query);
    return `https://github.com/login/oauth/authorize?${qs.stringify(query)}`;
};

exports.getGithubInfoByCode = async code => {
    const { data } = await axios({
        method: 'get',
        url: 'https://github.com/login/oauth/access_token',
        params: {
            client_id: config.github_client_id,
            client_secret: config.github_client_secret,
            code: code
        }
    });
    // 返回的 data："access_token=48e8957594ac41cd4809fea4143f66574aaa6a6a&scope=gist%2Crepo%2Cuser&token_type=bearer"
    const token = qs.parse(data).access_token;
    const githubInfo = await axios({
        method: 'get',
        url: 'https://api.github.com/user',
        params: {
            access_token: token
        }
    });
    return githubInfo;
};

exports.getUser = nickname => {
    const sql = 'select id from user where nickname = ?';
    const sqlParams = [nickname];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data[0]);
        });
    });
};

exports.addUser = ({ nickname, avatar, email, intro }) => {
    const sql =
        'insert into user(id, nickname, avatar_url, email, intro, role) values(?, ?, ?, ?, ?, 0)';
    const id = uuidv4();
    const sqlParams = [id, nickname, avatar, email, intro];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, err => {
            if (err) return reject(err);
            resolve(id);
        });
    });
};

exports.updateUser = ({ nickname, avatar, email, intro }) => {
    const sql =
        "update user set avatar_url = ?, email = ?, intro = ? where role = 0 and nickname = ?";
    const sqlParams = [avatar, email, intro, nickname];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, err => {
            if (err) return reject(err);
            resolve();
        });
    });
};
