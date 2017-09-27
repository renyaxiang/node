var connection = require('../common/db');
var EventProxy = require('eventproxy');
var PostService = require('../services/post');
var config = require('../config');


// 查询列表：分页、模糊查询
exports.getPosts = function (req, res, next) {
    var ep = new EventProxy();
    var key = req.query.key || '';    
    var page = req.query.page || 1;
    var per_page = req.query.per_page || 20;
    PostService.getPosts(key, page, per_page, function(err, posts){
        if(err){
            next(err);
            return;
        }
        ep.emit('posts', posts);
    });
    PostService.countPosts(key, function(err, count){
        if(err){
            next(err);
            return;
        }
        ep.emit('count', count);
    })
    ep.all('posts', 'count',  function(posts, count){
        res.render('post', {
            title: '文章列表',
            posts: posts,
            current_page: page,
            pages: Math.ceil(count/10),
            key: key
        });
    });
};
exports.getPostDetail = function (req, res, next) {
    var id = req.params.id;
    PostService.getPostDetail(id, function(err, post){
        if(err){
            next(err);
            return;
        }
        res.render('post-detail', {
            title: post.post_title,
            post: post
        });
    });
};
exports.updatePost = function (req, res, next) {
    var post_title = req.body.post_title;
    var id = req.body.id;
    PostService.updatePost(id, post_title, function(err, result){
        if(err){
            next(err);
            return;
        }
        res.send({
            isSuccessed: true
        });
    });
};
exports.delPost = function (req, res, next) {
    var id = req.params.id;
    PostService.delPost(id, function(err, result){
        if(err){
            next(err);
            return;
        }
        res.send({
            isSuccessed: true
        });
    });
}