const conn = require('../common/mysql');
const uuidv4 = require('uuid/v4');

function addTagsToPost(tagIds, postId) {
    const sql = tagIds
        .map(tagId => {
            const id = uuidv4();
            return `insert into post_tag(id, tag_id, post_id) values(${id}, ${tagId}, ${postId})`;
        })
        .join(',');
    return new Promise((resolve, reject) => {
        conn.query(sql, err => {
            if (err) reject(err);
            resolve();
        });
    });
}
function deleteTagsFromPost(postId) {
    const sql = 'delete from post_tag where post_id = ?';
    return new Promise((resolve, reject) => {
        conn.query(sql, postId, err => {
            if (err) reject(err);
            resolve();
        });
    });
}

exports.list = ({ userId = '', title = '', page = 1, perPage = 15 }) => {
    if (typeof page === 'string') {
        page = parseInt(page);
    }
    if (typeof perPage === 'string') {
        perPage = parseInt(perPage);
    }
    let sql =
        'select  p.id, u.nickname, u.avatar_url, p.title, p.content, c.name, p.creat_time, p.update_time, p.view_count from post p left join category c on p.category_id = c.id left join users u on p.user_id = u.id where 1 = 1 ';
    let sqlParams = [];
    if (userId) {
        sql += 'and p.user_id = ? ';
        sqlParams.push(userId);
    }
    if (title) {
        sql += 'and p.title like ? ';
        sqlParams.push('%' + title + '%');
    }
    sql += 'order by p.create_time desc limit ?, ?';
    sqlParams.push((page - 1) * perPage, perPage);
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

exports.count = ({ userId, title }) => {
    let sql = 'select count(id) as total from post where 1 = 1 ';
    let sqlParams = [];
    if (userId) {
        sql += 'and user_id = ? ';
        sqlParams.push(userId);
    }
    if (title) {
        sql += 'and title like ? ';
        sqlParams.push('%' + title + '%');
    }
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, data) => {
            if (err) reject(err);
            resolve(data[0].total);
        });
    });
};

exports.add = ({ userId, categoryId, title, content, poster, tagIds }) => {
    const sql =
        'insert into post(id, user_id, category_id, title, content, poster) values(?, ?, ?, ?, ?, ?)';
    const id = uuidv4();
    const sqlParams = [id, userId, categoryId, title, content, poster];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, err => {
            if (err) reject(err);
            resolve(id);
        });
    }).then(postId => {
        return addTagsToPost(tagIds, postId);
    });
};

exports.get = id => {
    const sql =
        'select  u.nickname, u.avatar_url, p.id, p.title, p.content, p.create_time, p.update_time, p.view_count from post p left join users u on p.user_id = u.id where p.id = ?';
    return new Promise((resolve, reject) => {
        conn.query(sql, id, (err, data) => {
            if (err) reject(err);
            resolve(data[0]);
        });
    })
        .then(post => {
            // 获取 tags 列表
            const sql =
                'select t.id, t.name from post_tag pt left join tag t on pt.tag_id = t.id where pt.post_id = ?';
            return new Promise((resolve, reject) => {
                conn.query(sql, id, (err, data) => {
                    if (err) reject(err);
                    post.tags = data;
                    resolve(post);
                });
            });
        })
        .then(post => {
            // 浏览数自动加1
            const sql = 'update post set view_count = ? where id = ?';
            const sqlParams = [post.view_count + 1, post.id];
            return new Promise((resolve, reject) => {
                conn.query(sql, sqlParams, err => {
                    if (err) reject(err);
                    resolve(post);
                });
            });
        });
};

exports.update = ({ id, title, content, categoryId, tagIds }) => {
    const sql =
        'update post set title = ?, content = ?, category_id = ? where id = ?';
    const sqlParams = [title, content, categoryId, id];
    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, err => {
            if (err) reject(err);
            resolve();
        });
    })
        .then(() => {
            return deleteTagsFromPost(id);
        })
        .then(() => {
            return addTagsToPost(tagIds, id);
        });
};

exports.delete = id => {
    const sql = 'delete from post where id = ?';
    return new Promise((resolve, reject) => {
        conn.query(sql, id, err => {
            if (err) reject(err);
            resolve();
        });
    }).then(() => {
        return deleteTagsFromPost(id);
    });
};
