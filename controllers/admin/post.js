/**
 * @author xiangry <xiangrenya.gmail.com>
 */
const EventProxy = require('eventproxy')
const PostService = require('../../services/post')
const config = require('../../config')
const utils = require('../../common/utils')


// 查询列表：分页、模糊查询
exports.getPostList = function (req, res, next) {
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

    PostService.getList(userId, key, page, perPage).then(datas => {
        ep.emit('posts', datas)
    }).catch(err => {
        next(err)
    })

    PostService.count(userId, key).then(data => {
        ep.emit('count', data)
    }).catch(err => {
        next(err)
    })
    
    ep.all('posts', 'count',  function(posts, count){
        res.render('admin/post', {
            title: '文章列表',
            posts: posts,
            currentPage: page,
            perPage: perPage,
            pages: Math.ceil(count/10),
            key: key
        })
    })
}