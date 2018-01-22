/**
 * @author xiangry <xiangrenya@gmail.com>
 */

var UserService = require('../services/user');
var utils = require('../common/utils');
var users = require('./mock').users;
console.log(users);
var i = 0;
var len = users.length;
// MySQL用单条INSERT语句处理多个插入比使用多条INSERT 语句快
users.forEach(function(user){
    UserService.registerUser(user.username, utils.cryptoPassword(user.password), user.email, function(err){
        console.log('%s. 插入用户: %s', ++i, user.username)
        if(i == len){
            process.exit();
        }
    });
});