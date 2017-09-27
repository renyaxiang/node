var connection = require('../../common/db');
var PostService = require('../../services/post');
exports.getPosts = function(req, res, next){
    var key = req.query.key || '';    
    var page = req.query.page || 1;
    var per_page = req.query.per_page || 20;
    PostService.getPosts(key, page, per_page, function(err, posts){
        if(err){
            next(err);
            return;
        };
        res.send(posts);
    });
};