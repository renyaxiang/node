var express = require('express');
var router = express.Router();
var post = require('./api/v1/post')

router.get('/posts', post.getPosts);

module.exports = router;