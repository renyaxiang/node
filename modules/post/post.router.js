const express = require('express');
const apiAuth = require('../../middlewares/api_auth');
const viewAuth = require('../../middlewares/view_auth');
const PostApi = require('./post.api');
const PostController = require('./post.controller');
const apiRouter = express.Router();
const webRouter = express.Router();

// 新增文章
apiRouter.post('/posts', apiAuth.userRequired, PostApi.add);
// 文章详情
apiRouter.get('/posts/:id', PostApi.get);
// 修改文章
apiRouter.put('/posts/:id', apiAuth.userRequired, PostApi.update);
// 文章列表
apiRouter.get('/posts', PostApi.list);
// 删除文章
apiRouter.delete('/posts/:id', apiAuth.userRequired, PostApi.delete);

// 文章列表页
webRouter.get('/posts', PostController.postListPage);
// 文章详情页
webRouter.get('/posts/:id', PostController.postDetailPage);
// 新增文章页
webRouter.get('/posts/add', viewAuth.userRequired, PostController.addPostPage);

module.exports = {
    apiRouter,
    webRouter
};
