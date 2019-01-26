const UserService = require('./user.service');

exports.loginPage = function(req, res) {
    res.render('login', {
        title: '登录',
        username: 'admin',
        password: 'admin.123'
    });
};
exports.signupPage = function(req, res) {
    res.render('signup', {
        title: '注册'
    });
};

// 登录
exports.login = function(req, res, next) {
    const { username, password } = req.body;
    if (username && password) {
        UserService.login(username, password)
            .then(data => {
                if (!data) {
                    return res.render('login', {
                        title: '登录',
                        username: username,
                        password: password,
                        error: '用户名或密码错误'
                    });
                }
                req.session.user = {
                    userId: data.id,
                    nickName: data.nickname,
                    isAdmin: data.role === 2
                };
                res.redirect(req.query.redirectUrl || '/posts');
            })
            .catch(err => {
                next(err);
            });
    } else {
        res.render('login', {
            title: '登录',
            username: username,
            password: password,
            error: '用户名或密码未填写'
        });
    }
};

exports.signout = function(req, res, next) {
    req.session.destroy();
    res.clearCookie('user', { path: '/' });
    res.clearCookie('connect.sid', { path: '/' });
    res.redirect('/');
};

exports.userListPage = async (req, res, next) => {
    let { username, page, perPage } = req.query;
    try {
        const users = await UserService.list(page, perPage, username);
        const count = await UserService.count(username);
        res.render('admin/user', {
            title: '用户列表',
            users: users,
            currentPage: page,
            perPage: perPage,
            pages: Math.ceil(count / perPage),
            key: username
        });
    } catch (err) {
        next(err);
    }
};
