const UserService = require('./user.service');
const utils = require('../../common/utils');

exports.signup = async (req, res, next) => {
    const { username, password, email } = utils.normalizeObj(req.body);
    if (!username || !password || !email) {
        return res.status(500).send({
            result: false,
            message: '请完善注册信息'
        });
    }
    try {
        if (await UserService.isValidUserName(username)) {
            return res.status(400).send({
                result: false,
                message: '用户名已存在'
            });
        }
        UserService.signup(username, password, email).then(user => {
            res.status(201).send(user);
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const { username, password } = utils.normalizeObj(req.body);
    if (!username || !password) {
        return res.status(400).send({
            result: false,
            message: '用户名或密码不能为空'
        });
    }
    try {
        const data = await UserService.login(username, password);
        const token = utils.signToken({
            userId: data.pid,
            status: data.status
        });
        const { password, ...rest } = data;
        res.send({
            ...rest,
            token
        });
    } catch (err) {
        return next(err);
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
    const { nickname, mobile, email, intro, avatar } = utils.normalizeObj(
        req.body
    );
    try {
        await UserService.update(id, nickname, mobile, email, intro, avatar);
    } catch (err) {
        next(err);
    }
    res.send({
        result: true,
        message: '更新用户信息成功'
    });
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
    const { username, page, perPage } = req.query;
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
        success: true,
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
