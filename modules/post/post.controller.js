const PostService = require('../services/post');

exports.addPostPage = function(req, res) {
    res.render('post/add', {
        title: '新增文章'
    });
};

exports.postListPage = async (req, res, next) => {
    const { userId } = req.session.currentUser;
    let { title, page, perPage } = req.query;
    try {
        const data = await PostService.list({ userId, title, page, perPage });
        const total = await PostService.count({ userId, title });
        res.render('post/index', {
            title: '文章列表',
            posts: data,
            currentPage: page,
            pages: Math.ceil(total / perPage),
            key: title
        });
    } catch (err) {
        next(err);
    }
};

exports.postDetailPage = async (req, res, next) => {
    const pid = req.params.id;
    try {
        const data = await PostService.get(pid);
        res.render('post/detail', {
            title: data.title,
            post: data
        });
    } catch (err) {
        next(err);
    }
};
