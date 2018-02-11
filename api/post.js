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

// 获取文章列表
exports.getList = function (req, res, next) {
    const userId = req.payload.status === 2 ? '' : req.payload.userId
    let {title = '', page = 1, perPage = 20} = req.query
    page = parseInt(page)
    perPage = parseInt(perPage)

    const postsPromise = new Promise((resolve, reject) => {
        PostService.getList(userId, title, page, perPage).then(datas => {
            resolve(datas)
        })    
    })

    const countPromise = new Promise((resolve, reject) => {
        PostService.count(userId, title).then(data => {
            resolve(data)
        })
    })

    Promise.all([postsPromise, countPromise]).then(([posts, count]) => {
        res.send({
            posts: posts,
            currentPage: page,
            total: count
        })
    }).catch(err => {
        next(err)
    })
}

// 新增文章
exports.add = function (req, res, next) {
    const userId = req.payload.userId
    const {title, content, categoryId} = utils.normalizeObj(req.body)
    PostService.add(userId, categoryId, title, content).then(() => {
        res.send({
            success: true,
            message: '新增文章成功'
        })
    }).catch(err => {
        next(err)
    })
}

// 文章详情
exports.getOne = function (req, res, next) {
    const id = req.params.id
    PostService.getOne(id).then((data) => {
        res.send({
            post: data
        })
    }).catch(err => {
        next(err)
    })
}

// 修改文章
exports.update = function (req, res, next) {
    const id = req.params.id
    const {title, content, categoryId} = utils.normalizeObj(req.body)
    PostService.update(id, title, content, categoryId).then(()=> {
        res.send({
            success: true,
            message: '修改文章成功'
        })
    }).catch(err => {
        next(err)
    })
}

// 删除文章
exports.delete = function (req, res, next) {
    const id = req.params.id
    PostService.delete(id).then(() => {
        res.send({
            successed: true,
            message: '删除文章成功'
        })
    }).catch(err => {
        next(err)
    })
}