var connection = require('../common/db');
var tools = require('../common/tool');
var user = {
    isExist: function(username, callback){
        var sql = 'select count(*) as count from wp_users where user_login = "' + username + '"';
        connection.query(sql, function (err, results) {
            var bl = results.length > 0 ? true : false;
            callback(err, bl);
        })
    },
    validatePassword: function(username, password, callback){
        var ecryptPassword = tools.encryptPassword(password);
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
};
module.exports = user;