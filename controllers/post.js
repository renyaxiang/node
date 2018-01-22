/**
 * @author xiangry <xiangrenya.gmail.com>
 */
const EventProxy = require('eventproxy')
const PostService = require('../services/post')
const config = require('../config')
const utils = require('../common/utils')

exports.showPostForm = function (req, res) {
    res.render('post_form', {
        title: '新增文章'
    })
}

// 查询列表：分页、模糊查询
exports.getPosts = function (req, res, next) {
    const ep = new EventProxy()
    const userId = null
    const key = req.query.key || ''
    let page = 1
    let perPage = 20
    if (req.query.page) {
        page = Number(req.query.page)
    }
    if (req.query.perPage) {
        perPage = Number(req.query.perPage)
    }

    PostService.getPostList(userId, key, page, perPage).then(datas => {
        ep.emit('posts', datas)
    }).catch(err => {
        next(err)
    })

    PostService.countPosts(userId, key).then(data => {
        ep.emit('count', data)
    }).catch(err => {
        next(err)
    })
    
    ep.all('posts', 'count',  function(posts, count){
        res.render('post', {
            title: '文章列表',
            posts: posts,
            currentPage: page,
            pages: Math.ceil(count/10),
            key: key
        })
    })
}

// 查看文章详情
exports.getPostDetail = function (req, res, next) {
    const pid = req.params.id

    PostService.getPostDetail(pid).then(data => {
        res.render('post_detail', {
            title: data.title,
            post: data
        })
    }).catch(err => {
        next(err)
    })
}

// 新增文章
exports.addPost = function (req, res, next) {
    const userId = req.session.currentUser.userId
    const body = utils.normalizeObj(req.body)
    const title = body.title
    const content = body.content

    if(title && content){
        PostService.addPost(userId, null, title, content).then((data)=>{
            res.redirect('/posts/' + data)
        }).catch(err => {
            next(err)
        })
    }
}