/**
 * @author xiangry <xiangrenya@gmail.com>
 * api列表[管理员]
    - 用户列表
    - 管理用户状态[禁用、普通用户、管理员]
    - 注销用户
 */

const EventProxy = require('eventproxy')
const utils = require('../../common/utils')
const UserService = require('../../services/user')

// 用户列表
exports.getUserList = function (req, res, next) {
    const ep = new EventProxy()
    const username = req.body && req.body.username || ''

    let page = 1
    let perPage = 20
    if (req.query.page) {
        page = Number(req.query.page)
    }
    if (req.query.perPage) {
        perPage = Number(req.query.perPage)
    }

    UserService.countUsers(username).then(data => {
        ep.emit('count', data)
    }).catch(err => {
        return next(err)
    })

    UserService.getUserList(page, perPage, username).then(datas => {
        ep.emit('users', datas)
    }).catch(err => {
        return next(err)
    })

    ep.all('users', 'count', (users, count) => {
        res.send({
            users: users,
            currentPage: page,
            totalCount: count
        })
    })
}

// 管理用户状态
exports.changeUserStatus = function (req, res, next) {
    const userId = req.body.userId
    const status = req.body.status

    UserService.changeUserStatus(userId, status).then(() => {
        res.status(200).send({
            success: true,
            message: '用户状态更新成功'
        })
    }).catch(err => {
        next(err)
    })
}

// 注销用户
exports.deleteUser = function (req, res, next) {
    const userId = req.params.id

    UserService.deleteUser(userId).then(() => {
        res.send({
            success: true,
            message: '注销用户成功'
        })
    }).catch(err => {
        next(err)
    })
}