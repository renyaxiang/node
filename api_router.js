/**
 * @author xiangry <xiangrenya@gmail.com>
 */

const express = require('express')
const auth = require('./middlewares/api_auth')
const user = require('./api/user')
const github = require('./api/github')
const post = require('./api/post')

const router = express.Router()

// 用户注册
router.post('/signup', user.signup)
// 用户登录
router.post('/login', user.login)

// github授权
router.get('/github/auth/:code', github.auth)
router.get('/github/token/:githubId', github.token)

// 用户权限
router.use(auth.userRequired)

// 用户详情
router.get('/users/:id', user.getOne)
// 修改用户信息
router.put('/users/:id', user.update)
// 重置密码
router.put('/users/:id/password', user.resetPassword)
// 用户列表
router.get('/users', auth.adminRequired, user.getList);
// 改变角色
router.put('/users/:id/status', auth.adminRequired, user.changeStatus);
// 注销用户
router.delete('/users/:id', auth.adminRequired, user.delete);

// 文章列表
router.get('/posts', post.getList)
// 新增文章
router.post('/posts', post.add)
// 文章详情
router.get('/posts/:id', post.getOne)
// 修改文章
router.put('/posts/:id', post.update)
// 删除文章
router.delete('/posts/:id', post.delete)

module.exports = router