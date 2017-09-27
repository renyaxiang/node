var connection = require('../common/db');

exports.index = function(req, res){
    res.render('setting', {
        title: '个人设置'
    });
};