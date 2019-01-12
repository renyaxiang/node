const express = require('express');
const router = express.Router();
const { userApiRouter } = require('./modules/user/user.router');
const { githubApiRouter } = require('./modules/github/github.router');
const { postApiRouter } = require('./modules/post/post.router');

[userApiRouter, githubApiRouter, postApiRouter].forEach(apiRouter => {
    router.use(apiRouter);
});

module.exports = router;
