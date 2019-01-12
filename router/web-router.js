const express = require('express');
const router = express.Router();
const { webRouter: userWebRouter } = require('../modules/user/user.router');
const { webRouter: postWebRouter } = require('../modules/post/post.router');

[userWebRouter, postWebRouter].forEach(webRouter => {
    router.use(webRouter);
});

module.exports = router;
