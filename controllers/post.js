/**
 * @author xiangry <xiangrenya.gmail.com>
 */
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
    const currentUser = req.session.currentUser
    const userId = currentUser.isAdmin ? null : currentUser.userId
    let { key = '', page = 1, perPage = 20 } = req.query

    page = parseInt(page)
    perPage = parseInt(perPage)

    var postsPromise = new Promise((resolve, reject) => {
        PostService.getPostList(userId, key, page, perPage).then(posts => {
            resolve(posts)
        })
    })

    var countPromise = new Promise((resolve, reject) => {
        PostService.countPosts(userId, key).then(count => {
            resolve(count)
        })
    })

    Promise.all([postsPromise, countPromise]).then(([posts, count]) => {
        res.render('post', {
            title: '文章列表',
            posts: posts,
            currentPage: page,
            pages: Math.ceil(count / 10),
            key: key
        })
    }).catch(err => {
        next(err)
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
    const {title, content} = utils.normalizeObj(req.body)
    
    if (title && content) {
        PostService.addPost(userId, null, title, content).then((data) => {
            res.redirect('/posts/' + data)
        }).catch(err => {
            next(err)
        })
    }
}