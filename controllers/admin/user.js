/**
 * @author xiangry <xiangrenya.gmail.com>
 */
const EventProxy = require('eventproxy')
const UserService = require('../../services/user')
const config = require('../../config')
const utils = require('../../common/utils')


// 查询列表：分页、模糊查询
exports.getUserList = function (req, res, next) {
    const ep = new EventProxy()
    const username = req.query.username
    let page = 1
    let perPage = 20
    if (req.query.page) {
        page = Number(req.query.page)
    }
    if (req.query.perPage) {
        perPage = Number(req.query.perPage)
    }

    UserService.getUserList(page, perPage, username).then(datas => {
        ep.emit('users', datas)
    }).catch(err => {
        next(err)
    })

    UserService.countUsers(username).then(data => {
        ep.emit('count', data)
    }).catch(err => {
        next(err)
    })
    
    ep.all('users', 'count',  function(users, count){
        res.render('admin/user', {
            title: '用户列表',
            users: users,
            currentPage: page,
            perPage: perPage,
            pages: Math.ceil(count/10),
            key: key
        })
    })
}

// 查看文章详情
exports.getPostDetail = function (req, res, next) {
    const pid = req.params.id

    UserService.getPostDetail(pid).then(data => {
        res.render('post_detail', {
            title: data.title,
            post: data
        })
    }).catch(err => {
        next(err)
    })
}