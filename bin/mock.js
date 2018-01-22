/**
 * @author xiangry <xiangrenya@gmail.com>
 */

const Mock = require('mockjs');
const users = Mock.mock({
    'list|1-10': [{
        'username': '@first',
        'email': '@email(qq.com)',
        'password': '@string(7, 10)',
        'avatar-url': '@image("100x100", "#ffffff", "#666666", "")'
    }]
});

const posts = Mock.mock({
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'list|1-10': [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'user_id': '@guid',
        'title': '@ctitle',
        'content': '@cparagraph'
    }]
});

exports.users = users.list;
exports.posts = posts.list;
const data = {
    users: users.list,
    posts: posts.list
};

console.log(data);
module.exports = data;

// console.log(posts.list);