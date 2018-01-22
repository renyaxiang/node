const express = require('express')
const router = express.Router()
const auth = require('./middlewares/view_auth')
const index = require('./controllers/index')
const user = require('./controllers/user')
const my = require('./controllers/my')
const post = require('./controllers/post')
const api = require('./controllers/api')
const setting = require('./controllers/setting')

const adminPost = require('./controllers/admin/post')
const adminUser = require('./controllers/admin/user')

router.get('/', index.index)

// admin
router.get('/admin/users', auth.adminRequired, adminUser.getUserList)
router.get('/admin/posts', auth.adminRequired, adminPost.getPostList)


// user
router.get('/signup', user.showSignup)
router.post('/signup', user.signup)
router.get('/login', user.showLogin)
router.post('/login', user.login)
router.get('/signout', user.signout)

// post
router.get('/posts', auth.userRequired, post.getPosts)
router.get('/posts/:id', post.getPostDetail)
router.get('/post/form', post.showPostForm)
router.post('/post', post.addPost)

// apis
router.get('/apis', api.index)

// setting
router.get('/setting', auth.adminRequired, setting.index)

// my
router.get('/my', my.index)

// admin
router.get('/admin', auth.adminRequired, function(req,res){
    res.render('admin/index', {
        title: '后台管理'
    })
})

module.exports = router