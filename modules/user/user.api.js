const UserService = require('./user.service');
const utils = require('../../common/utils');

exports.signup = async (req, res, next) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(500).send({
            result: false,
            message: '请完善注册信息'
        });
    }
    try {
        const hasUserName = await UserService.isValidUserName(username);
        if (hasUserName) {
            return res.status(400).send({
                result: false,
                message: '用户名已存在'
            });
        }
        const userId = await UserService.signup(username, password, email);
        res.send({
            result: true,
            data: {
                username,
                nickname: username,
                email,
                role: 1,
                token: utils.signToken({
                    userId,
                    role: 1
                })
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({
            result: false,
            message: '用户名或密码不能为空'
        });
    }
    try {
        const data = await UserService.login(username, password);
        if (data) {
            delete data.password;
            return res.send({
                result: true,
                data: {
                    ...data,
                    token: utils.signToken({
                        userId: data.id,
                        role: data.role
                    })
                }
            });
        }
        res.send({
            result: false,
            message: '用户名或密码错误'
        });
    } catch (err) {
        next(err);
    }
};

exports.get = async (req, res, next) => {
    const id = req.params.id;
    try {
        const data = await UserService.get(id);
        res.send(data);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    const id = req.params.id;
    try {
        await UserService.update({
            id,
            ...req.body
        });
        res.send({
            result: true,
            message: '更新用户信息成功'
        });
    } catch (err) {
        next(err);
    }
};

exports.changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const id = req.payload.userId;
    try {
        const isValid = await UserService.isValidPassword(id, oldPassword);
        if (!isValid) {
            return res.status(500).send({
                result: false,
                message: '原始密码不正确'
            });
        }
        await UserService.changePassword(id, newPassword);
        res.send({
            result: true,
            message: '成功修改密码'
        });
    } catch (err) {
        next(err);
    }
};

exports.list = async (req, res, next) => {
    const { username, page = 1, perPage = 10 } = req.query;
    try {
        const users = await UserService.list(page, perPage, username);
        const count = await UserService.count(username);
        res.send({
            data: users,
            page: {
                pageNum: page,
                total: count
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    const id = req.params.id;
    try {
        await UserService.delete(id);
    } catch (err) {
        next(err);
    }
    res.send({
        result: true,
        message: '注销用户成功'
    });
};

exports.changeStatus = async (req, res, next) => {
    const id = req.params.id;
    const status = req.body.status;
    try {
        await UserService.changeStatus(id, status);
    } catch (err) {
        next(err);
    }
    res.send({
        result: true,
        message: '改变用户角色成功'
    });
};
