/**
 * @author xiangry <xiangrenya@gmail.com>
 * api列表
    - 文章列表（分页、模糊查询）
    - 新增文章
    - 修改文章
    - 删除文章
 */

const utils = require('../common/utils')
const PostService = require('../services/post')
const EventProxy = require('eventproxy')

// 获取文章列表
exports.getPostList = function (req, res, next) {
    const ep = new EventProxy()

    const userId = req.payload.userId
    const title = req.body && req.body.title || ''

    let page = 1
    let perPage = 20
    if (req.query.page) {
        page = Number(req.query.page)
    }
    if (req.query.perPage) {
        perPage = Number(req.query.perPage)
    }

    PostService.getPostList(userId, title, page, perPage).then(datas => {
        ep.emit('posts', datas)
    }).catch(err => {
        next(err)
    })

    PostService.getPostCount(userId, title).then(data => {
        ep.emit('count', data)
    }).catch(err => {
        next(err)
    })

    ep.all('posts', 'count', function (posts, count) {
        res.send({
            posts: posts,
            currentPage: page,
            totalCount: count
        })
    })
}

// 新增文章
exports.addPost = function (req, res, next) {
    const userId = req.payload.userId
    const body = utils.normalizeObj(req.body)
    const title = body.title
    const content = body.content
    const categoryId = body.categoryId

    PostService.addPost(userId, categoryId, title, content).then(() => {
        res.send({
            success: true,
            message: '新增文章成功'
        })
    }).catch(err => {
        next(err)
    })
}

// 文章详情
exports.getPostDetail = function (req, res, next) {
    const pid = req.params.id

    PostService.getPostDetail(pid).then((data) => {
        res.send({
            post: data
        })
    }).catch(err => {
        next(err)
    })
}

// 修改文章
exports.updatePost = function (req, res, next) {
    const pid = req.params.id
    const body = utils.normalizeObj(req.body)
    const title = body.title
    const content = body.content
    const categoryId = body.categoryId

    PostService.updatePost(pid, title, content, categoryId).then(()=> {
        res.send({
            success: true,
            message: '修改文章成功'
        })
    }).catch(err => {
        next(err)
    })
}

// 删除文章
exports.deletePost = function (req, res, next) {
    const pid = req.params.id

    PostService.deletePost(pid).then(() => {
        res.send({
            successed: true,
            message: '删除文章成功'
        })
    }).catch(err => {
        next(err)
    })
}