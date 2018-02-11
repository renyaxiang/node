/**
 * @author xiangry <xiangrenya@gmail.com>
 * @description 用户api
    - 注册
    - 登录
    - 获取用户信息
    - 修改用户信息
    - 重置密码
    <<< 管理员操作权限 >>>
    - 查看用户列表（分页、模糊查询）
    - 注销用户
    - 改变用户角色（禁用、普通用户、管理员）
 */

const UserService = require('../services/user')
const utils = require('../common/utils')

// 注册
exports.signup = function (req, res, next) {
    const { username, password, email } = utils.normalizeObj(req.body)
    if (username && password && email) {
        // 判断用户名是否已存在
        UserService.isValidUserName(username)
            .then(isValid => {
                if (isValid) return res.status(400).send({
                    sucess: false,
                    message: '用户名已存在'
                })
                UserService.signup(username, password, email)
                    .then(user => {
                        res.status(201).send(user)
                    })
                    .catch(err => {
                        next(err)
                    })
            })
            .catch(err => {
                next(err)
            })
    } else {
        res.status(500).send({
            success: false,
            message: '请完善注册信息'
        })
    }
}

// 登录
exports.login = function (req, res, next) {
    const { username, password } = utils.normalizeObj(req.body)
    if (!username || !password) {
        return res.status(400).send({
            success: false,
            message: '用户名或密码不能为空'
        })
    }
    UserService.login(username, password).then(data => {
        if (!data) return res.status(500).send({
            success: false,
            message: '用户名或密码错误'
        })
        const token = utils.signToken({
            userId: data.pid,
            status: data.status
        })
        res.send({
            id: data.pid,
            username: data.username,
            nickname: data.nickname,
            intro: data.intro,
            mobile: data.mobile,
            email: data.email,
            avatar: data.avatar,
            status: data.status,
            token: token
        })
    })
}

// 获取用户信息
exports.getOne = function (req, res, next) {
    const id = req.params.id
    UserService.getOne(id).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    })
}

// 修改用户信息
exports.update = function (req, res, next) {
    const id = req.params.id
    const { nickname, mobile, email, intro, avatar } = utils.normalizeObj(req.body)
    UserService.update(id, nickname, mobile, email, intro, avatar).then(data => {
        res.send({
            success: true,
            message: '更新用户信息成功'
        })
    }).catch(err => {
        next(err)
    })
}

// 重置密码
exports.resetPassword = function (req, res, next) {
    const { oldPassword, newPassword } = req.body
    const id = req.payload.userId
    // 判断旧密码是否正确
    UserService.isValidPassword(id, oldPassword)
        .then(isValid => {
            if (!isValid) {
                return res.status(500).send({
                    success: false,
                    message: '原始密码不正确'
                })
            }
            UserService.resetPassword(id, newPassword)
                .then(() => {
                    res.send({
                        success: true,
                        message: '成功修改密码'
                    })
                })
                .catch(err => {
                    next(err)
                })
        })
        .catch(err => {
            next(err)
        })
}

/**
 * 管理员操作权限
 */

// 用户列表
exports.getList = function (req, res, next) {
    let { username = '', page = 1, perPage = 20 } = req.query
    page = parseInt(page)
    perPage = parseInt(perPage)

    const usersPromise = new Promise((resolve, reject) => {
        UserService.getList(page, perPage, username).then(datas => {
            resolve(datas)
        })
    })

    const countPromise = new Promise((resolve, reject) => {
        UserService.count(username).then(data => {
            resolve(data)
        })
    })

    Promise.all([usersPromise, countPromise]).then(([users, count]) => {
        res.send({
            users: users,
            currentPage: page,
            total: count
        })
    }).catch(err => {
        next(err)
    })
}

// 注销用户
exports.delete = function (req, res, next) {
    const id = req.params.id
    UserService.delete(id).then((data) => {
        res.send({
            success: true,
            message: '注销用户成功'
        })
    }).catch(err => {
        next(err)
    })
}

// 改变用户角色
exports.changeStatus = function (req, res, next) {
    const id = req.params.id
    const status = req.body.status
    UserService.changeStatus(id, status).then((data) => {
        res.send({
            success: true,
            message: '改变用户角色成功'
        })
    }).catch(err => {
        next(err)
    })
}