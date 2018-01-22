/**
 * @author xiangry <xiangrenya@gmail.com>
 */

var express = require('express');
var apiAuth = require('./middlewares/api_auth');
var adminUser = require('./api/admin/user');

var router = express.Router();

// 管理员权限
router.use(apiAuth.adminRequired);

// 用户列表
router.post('/users', adminUser.getUserList);
// 禁用|解禁用户
router.put('/users/:id/:status', adminUser.changeUserStatus);
// 注销用户
router.delete('/users/:id', adminUser.deleteUser);

module.exports = router;