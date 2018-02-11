const express = require('express')
const router = express.Router()
const auth = require('./middlewares/view_auth')
const index = require('./controllers/index')
const user = require('./controllers/user')
const my = require('./controllers/my')
const post = require('./controllers/post')
const setting = require('./controllers/setting')

const wiki = require('./controllers/wiki')

const adminPost = require('./controllers/admin/post')
const adminUser = require('./controllers/admin/user')

router.use((req, res, next) => {
    res.locals.currentUser = req.session.currentUser || null
    next()
})

router.get('/', index.index)

// admin
router.get('/admin/users', auth.adminRequired, adminUser.getList)
router.get('/admin/posts', auth.adminRequired, adminPost.getPostList)

// user
router.get('/signup', user.showSignup)
router.post('/signup', user.signup)
router.get('/login', user.showLogin)
router.post('/login', user.login)
router.get('/signout', user.signout)

// post
router.get('/posts', auth.userRequired, post.getList)
router.get('/posts/:id', post.getOne)
router.get('/post/form', post.showPostForm)
router.post('/post', post.add)

// wiki
router.get('/wikis', wiki.index)
router.post('/wikis', wiki.add)
router.get('/wiki/add', wiki.showAdd)


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

// wiki
router.get('/wikis', wiki.index)

module.exports = router