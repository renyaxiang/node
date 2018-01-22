/**
 * @author xiangry <xiangrenya@gmail.com>
 * api列表
    - 注册
    - 登录
    - 重置密码
    - 获取用户信息
    - 修改用户信息
 */

const UserService = require('../services/user')
const utils = require('../common/utils')


// 注册
exports.signup = function (req, res, next) {
    const body = utils.normalizeObj(req.body)
    const username = body.username
    const password = body.password
    const email = body.email

    if (username && password && email) {
        UserService.validateUserName(username).then(bl => {
            if (bl) {
                res.status(400).send({
                    sucess: false,
                    message: '用户名已存在'
                })
            }else{
                UserService.registerUser(username, password, email).then(() => {
                    res.status(201).send({
                        success: true,
                        message: '成功注册账号'
                    })
                }).catch(err => {
                    next(err)
                })
            }
        }).catch(err => {
            next(err)
        })
    } else {
        res.status(400).send({
            success: false,
            message: '请完善注册信息'
        })
    }
}

// 登录
exports.login = function (req, res, next) {
    const body = utils.normalizeObj(req.body)
    const username = body.username
    const password = body.password

    if (username && password) {
        UserService.userLogin(username, password).then((data) => {
            if (data) {
                const token = utils.signToken({
                    userId: data.pid,
                    status: data.status
                })
                res.send({
                    user: {
                        id: data.pid,
                        username: data.username,
                        nickname: data.nickname,
                        intro: data.intro,
                        mobile: data.mobile,
                        email: data.email,
                        avatar_url: data.avatarUrl,
                        status: data.status
                    },
                    token: token
                })
            } else {
                return res.status(500).send({
                    success: false,
                    message: '用户名或密码错误'
                })
            }
        })
    } else {
        res.status(400).send({
            success: false,
            message: '用户名或密码不能为空'
        })
    }
}

// 重置密码
exports.resetPassword = function (req, res, next) {
    const body = req.body
    const oldPassword = body.oldPassword
    const newPassword = body.newPassword
    const userId = req.payload.userId

    UserService.validatePassword(userId, oldPassword).then(bl => {
        if(bl){
            UserService.changeUserPassword(userId, newPassword).then(() =>{
                res.status(200).send({
                    success: true,
                    message: '成功修改密码'
                })
            }).catch( err => {
                next(err)
            })
        }else{
            res.status(500).send({
                success: false,
                message: '原始密码不正确'
            })
        }
    }).catch(err => {
        next(err)
    })

}

// 获取用户信息
exports.getUserDetail = function (req, res, next) {
    const userId = req.payload.userId

    UserService.getUserDetail(userId).then(data => {
        res.send(data)
    }).catch(err =>{
        next(err)
    })
}

// 修改用户信息
exports.updateUser = function (req, res, next) {
    const userId = req.payload.userId
    const body = utils.normalizeObj(req.body)
    const nickname = body.nickname
    const mobile = body.mobile
    const email = body.email
    const intro = body.intro
    const avatarUrl = body.avatarUrl

    UserService.updateUser(userId, nickname, mobile, email, intro, avatarUrl).then((data) => {
        res.send({
            success: true,
            message: '更新用户信息成功'
        })
    }).catch(err => {
        next(err)
    })
}