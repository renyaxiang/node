/**
 * @author xiangry <xiangrenya@gmail.com>
 * @description 用户控制器
 * - 显示登录页
 * - 显示注册页
 * - 注册
 * - 登录
 * - 安全退出
 */

const utils = require('../common/utils')
const UserService = require('../services/user')

exports.showLogin = function (req, res) {
    res.render('login', {
        title: '登录',
        username: 'admin',
        password: 'admin.123'
    })
}
exports.showSignup = function (req, res) {
    res.render('signup', {
        title: '注册'
    })
}

// 注册
exports.signup = function (req, res, next) {
    const {username, password, repassword, email} = utils.normalizeObj(req.body)

    if (username && password && email) {
        if (password != repassword) return errorHandler('两次密码不一致')
        UserService.isValidUserName(username).then(isExist => {
            if (isExist) return errorHandler('用户名已存在')
            return UserService.signup(username, password, email)
        }).then(user => {
            req.session.currentUser = {
                userId: user.pid,
                nickName: user.username,
                isAdmin: false
            }
            res.redirect('/')
        }).catch(err => {
            next(err)
        })
    } else {
        errorHandler('请填写完整的信息')
    }

    function errorHandler(msg){
        res.render('signup', {
            title: '注册',
            username: username,
            password: password,
            repassword: repassword,
            email: email,
            error: msg
        })
    }
}

// 登录
exports.login = function (req, res, next) {
    const {username, password} = utils.normalizeObj(req.body)

    if (username && password) {
        UserService.login(username, password).then(data => {
            if(!data) return errorHandler('用户名或密码错误')
            req.session.currentUser = {
                userId: data.pid,
                nickName: data.nickname,
                isAdmin: data.status === 2
            }
            res.redirect(req.query.redirectUrl || '/posts')
        }).catch(err => {
            next(err)
        })
    } else {
        errorHandler('用户名或密码未填写')
    }

    function errorHandler(msg){
        res.render('login', {
            title: '登录',
            username: username,
            password: password,
            error: msg
        })
    }
}

// 安全退出
exports.signout = function (req, res, next) {
    req.session.destroy()
    res.clearCookie('user', { path: '/' })
    res.clearCookie('connect.sid', { path: '/' })
    res.redirect('/')
}