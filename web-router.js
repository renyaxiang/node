const express = require('express');
const router = express.Router();
const { userWebRouter } = require('./modules/user/user.router');
const { githubWebRouter } = require('./modules/github/github.router');
const { postWebRouter } = require('./modules/post/post.router');

[userWebRouter, githubWebRouter, postWebRouter].forEach(webRouter => {
    router.use(webRouter);
});

module.exports = router;
