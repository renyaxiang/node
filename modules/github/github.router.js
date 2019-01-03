const express = require('express');
const GithubApi = require('./github.api');
const router = express.Router();

// 授权获取 github 授权页地址
router.get('/github/login', GithubApi.login);
// 授权获取 github 信息
router.get('/github/info/:code', GithubApi.info);
// 授权获取 github 信息
router.get('/github/oauth/:code', GithubApi.oauth);

module.exports = router;
