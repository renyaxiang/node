var express = require('express');
var router = express.Router();
var auth = require('./middlewares/auth');
var user = require('./controllers/user');
var post = require('./controllers/post');
var setting = require('./controllers/setting');

router.get('/', function (req, res) {
    res.render('home', {
        title: '首页',
        words: 'hello world'
    });
});

// user
router.get('/signup', user.showSignup);
router.post('/signup', user.signup);
router.get('/login', user.showLogin);
router.post('/login', user.login);
router.get('/signout', user.signout);

// post
router.get('/posts', auth.userRequired, post.getPosts);
router.get('/posts/:id', post.getPostDetail);
router.put('/posts', post.updatePost);

// setting
router.get('/setting', auth.userRequired, setting.index);

// my
router.get('/user/:id', function(req,res){
    res.render('my', {
        title: '个人中心'
    })
});

// admin
router.get('/admin', function(req,res){
    res.render('admin/index', {
        title: '后台管理'
    })
});

module.exports = router;