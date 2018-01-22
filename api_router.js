/**
 * @author xiangry <xiangrenya@gmail.com>
 */

const express = require('express')
const apiAuth = require('./middlewares/api_auth')
const user = require('./api/user')
const github = require('./api/github')
const post = require('./api/post')

const router = express.Router()

// 注册
router.post('/signup', user.signup)
// 登录
router.post('/login', user.login)

// github授权
router.get('/github/auth/:code', github.auth)
router.get('/github/token/:githubId', github.token)

// 用户权限
router.use(apiAuth.userRequired)

// 用户详情
router.get('/user', user.getUserDetail)
// 修改用户信息
router.put('/user', user.updateUser)
// 重置密码
router.put('/user/resetPassword', user.resetPassword)

// 查询文章列表
router.post('/posts', post.getPostList)
// 新增文章
router.post('/post', post.addPost)
// 文章详情
router.get('/posts/:id/', post.getPostDetail)
// 修改文章
router.put('/posts/:id/', post.updatePost)
// 删除文章
router.delete('/posts/:id/', post.deletePost)

module.exports = router