const PostService = require('./post.service');

exports.list = async (req, res, next) => {
    const { userId } = req.payload;
    let { title, page, perPage } = req.query;
    try {
        const data = await PostService.list({ userId, title, page, perPage });
        const total = await PostService.count({ userId, title });
        res.send({
            data,
            page: {
                pageNum: page,
                total
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.add = async (req, res, next) => {
    const { userId } = req.payload;
    try {
        await PostService.add({
            userId,
            ...req.body
        });
        res.send({
            result: true,
            message: '创建文章成功'
        });
    } catch (err) {
        next(err);
    }
};

exports.get = async (req, res, next) => {
    const id = req.params.id;
    try {
        const data = await PostService.get(id);
        res.send(data);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    const id = req.params.id;
    try {
        await PostService.update({
            id,
            ...req.body
        });
        res.send({
            result: true,
            message: '更新文章成功'
        });
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    const id = req.params.id;
    try {
        await PostService.delete(id);
        res.send({
            result: true,
            message: '删除文章成功'
        });
    } catch (err) {
        next(err);
    }
};
