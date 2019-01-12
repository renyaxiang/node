const express = require('express');
const router = express.Router();
const { apiRouter: userApiRouter } = require('../modules/user/user.router');
const { apiRouter: postApiRouter } = require('../modules/post/post.router');
const githubApiRouter = require('../modules/github/github.router');

[userApiRouter, githubApiRouter, postApiRouter].forEach(apiRouter => {
    router.use(apiRouter);
});

module.exports = router;
0