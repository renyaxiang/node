## 技术栈

express + mysqljs + ejs-mate + log4js + axios + bootstrap

## 环境和工具安装

- [Node](http://nodejs.cn)
- [MySQL](https://www.mysql.com)
- [Redis](https://redis.io)
- [Git](https://git-scm.com)
- [VSCode](https://code.visualstudio.com)
- [Navicat for MySQL](http://pan.baidu.com/s/1gfgoIUB)
- [Redis-Desktop-Manager](http://pan.baidu.com/s/1jHFeS9C)
- [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=zh-CN)

## 开发功能

- [x] 用户管理
- [x] 接口认证
- [x] 会话管理
- [x] github 授权
- [ ] 邮件通知

## 开发接口

- [x] POST api/v1/signup 注册
- [x] POST api/v1/login 登录
- [x] GET api/v1/users 用户列表
- [x] GET api/v1/users/:id 用户详情
- [x] PUT api/v1/users/:id 修改用户信息
- [x] PUT api/v1/users/:id/password 重置密码
- [x] DELETE api/v1/users/:id 注销用户
- [x] GET api/v1/github/login 获取 github 授权页面地址
- [x] GET api/v1/github/info/:code 查看 github 授权信息
- [x] GET api/v1/github/oauth/:code 授权后，获取带 token 的用户信息
- [x] POST api/v1/posts 新增文章
- [x] GET api/v1/posts 文章列表
- [x] GET api/v1/posts/:id 文章详情
- [x] PUT api/v1/posts/:id 修改文章
- [x] DELETE api/v1/posts/:id 删除文章

## 数据库模型

### User
id
username,
nickname,
email,
password,
avatar_url,
mobile,
gender,
role,
update_time,
create_time
### Post
id,
user_id,
category_id,
title,
content,
poster,
status,
view_count,
update_time,
create_time
### Category
id,
name,
update_time,
create_time
### Tag
id,
name,
create_time
### Post_Tag
id,
post_id,
tag_id,
create_time


