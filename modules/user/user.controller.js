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
