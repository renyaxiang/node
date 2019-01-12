exports.adminRequired = function(req, res, next) {
    if (req.session.currentUser.isAdmin) {
        next();
    } else {
        res.render('error', {
            title: '无权限访问该页面',
            msg: '无权限访问该页面'
        });
    }
};

exports.userRequired = function(req, res, next) {
    if (req.session && req.session.currentUser) {
        next();
    } else {
        res.redirect('/login?redirectUrl=' + req.originalUrl);
    }
};
