/**
 * @author xiangry <xiangrenya@gmail.com>
 */

const EventProxy = require('eventproxy')
const utils = require('../common/utils')
const UserService = require('../services/user')


exports.showLogin = function (req, res) {
    res.render('login', {
        title: '登录'
    })
}
exports.showSignup = function (req, res) {
    res.render('signup', {
        title: '注册'
    })
}

// 注册
exports.signup = function (req, res, next) {
    const ep = new EventProxy()
    const body = utils.normalizeObj(req.body)
    const username = body.username
    const password = body.password
    const repassword = body.repassword
    const email = body.email

    if (username && password && email) {
        if (password != repassword) {
            return ep.emit('prop_err', '两次密码不一致')
        }
        UserService.validateUserName(username).then(bl => {
            if (bl) {
                ep.emit('prop_err', '用户名已存在')
            } else {
                UserService.registerUser(username, password, email).then(() => {
                    res.redirect('/')
                }).catch(err => {
                    next(err)
                })
            }
        }).catch(err => {
            next(err)
        })
    } else {
        ep.emit('prop_err', '请填写完整的信息')
        return
    }
    ep.on('prop_err', function (msg) {
        res.render('signup', {
            title: '注册',
            username: username,
            password: password,
            repassword: repassword,
            email: email,
            error: msg
        })
    })
}

// 登录
exports.login = function (req, res, next) {
    const ep = new EventProxy()
    const body = utils.normalizeObj(req.body)
    const username = body.username
    const password = body.password

    if (username && password) {
        UserService.userLogin(username, password).then(data => {
            if (data) {
                req.session.currentUser = {
                    userId: data.pid,
                    nickName: data.nickname,
                    isAdmin: data.status === 2
                }
                const redirectUrl = req.query.redirectUrl || '/posts'
                res.redirect(redirectUrl)
            } else {
                ep.emit('prop_err', '用户名或密码错误')
            }
        }).catch(err => {
            next(err)
        })
    } else {
        ep.emit('prop_err', '用户名或密码未填写')
        return
    }

    ep.on('prop_err', msg => {
        res.render('login', {
            title: '登录',
            username: username,
            password: password,
            error: msg
        })
    })

}

exports.signout = function (req, res, next) {
    req.session.destroy()
    res.clearCookie('user', { path: '/' })
    res.clearCookie('connect.sid', { path: '/' })
    res.redirect('/')
}