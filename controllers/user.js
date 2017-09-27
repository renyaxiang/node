var EventProxy = require('eventproxy');
var connection = require('../common/db');
var tools = require('../common/tools');

exports.showLogin = function (req, res) {
    res.render('login', {
        title: '登录'
    });
};
exports.showSignup = function (req, res) {
    res.render('signup', {
        title: '注册'
    });
};
exports.signup = function (req, res, next) {
    var ep = new EventProxy();
    ep.on('prop_err', function (msg) {
        res.render('signup', {
            title: '注册',
            username: body.username,
            password: body.password,
            repassword: body.repassword,
            email: body.email,
            error: msg
        });
    });
    ep.fail(next);
    var body = req.body;
    for (var key in body) {
        body[key] = body[key].trim();
    }
    if (body.username && body.password && body.email) {
        if (body.password != body.repassword) {
            ep.emit('prop_err', '两次密码不一致');
            return;
        }

        var sql2 = 'select count(*) as count from wp_users where user_login = "' + body.username + '"';
        connection.query(sql2, function (err, users) {
            if (err) {
                next(err);
            } else {
                if (users[0].count > 0) {
                    ep.emit('prop_err', '用户名已存在');
                } else {
                    var ecryptPassword = tools.encryptPassword(body.password);
                    var sql = 'insert into wp_users(user_login, user_pass, user_nicename, user_email) values(?, ?, ?, ?)';
                    var sqlParams = [body.username, ecryptPassword, body.username, body.email];
                    connection.query(sql, sqlParams, function (err, user) {
                        if (err) {
                            next(err);
                        } else {
                            res.redirect('/');
                        }
                    });
                }
            }
        });

    } else {
        ep.emit('prop_err', '请填写完整的信息');
        return;
    }
};
exports.login = function (req, res, next) {
    var ep = new EventProxy();
    ep.on('prop_err', function (msg) {
        res.render('login', {
            title: '登录',
            username: body.username,
            password: body.password,
            error: msg
        });
    });
    ep.fail(next);
    var body = req.body;
    for (var key in body) {
        body[key] = body[key].trim();
    }
    var sql = 'select ID, user_login, user_pass from wp_users where user_login = "' + body.username + '"';
    if (body.username && body.password) {
        connection.query(sql, function (err, users) {
            if (err) {
                next(err);
            } else {
                if (users.length === 0) {
                    ep.emit('prop_err', '用户不存在');
                    return;
                } else {
                    var savestate = req.body.savestate;
                    var maxAge = savestate === 'on' ? Number.MAX_SAFE_INTEGER : 1000 * 60 * 10;
                    var ecryptPassword = tools.encryptPassword(body.password);
                    if (ecryptPassword === users[0].user_pass) {
                        // 方案一：通过客户端cookie记录客户状态。缺点：1、账号信息存在cookie里，存在安全风险，如果要用的话，md5签名加密。2、cookie有大小和数量限制。
                        res.cookie("user", {
                            username: body.username,
                            password: ecryptPassword
                        }, {
                                maxAge: maxAge,
                                signed: true,
                                httpOnly: true
                            });
                        // 方案二：通过服务端session记录客户状态
                        req.session.user_id = users[0].ID;
                        req.session.user = {
                            username: users[0].user_login
                        };
                        res.redirect('/posts');
                    } else {
                        ep.emit('prop_err', '密码错误');
                        return;
                    };
                }
            }
        });
    } else {
        ep.emit('prop_err', '用户名或密码未填写');
        return;
    }
};
exports.signout = function (req, res, next) {
    req.session.destroy();        
    res.clearCookie('user', { path: '/' });
    res.redirect('/');
};