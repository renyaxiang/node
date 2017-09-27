var connection = require('../common/db');
exports.getPosts = function(key, page, per_page, callback){
    var sql;
    var offset = (page-1)*per_page;
    if(key){
        key = '%' + key + '%';
        sql = 'select p.ID, p.post_title, p.post_date, u.user_login from wp_posts p left join wp_users u on p.post_author = u.ID where p.post_title like ? or u.user_login like ? order by p.post_date desc limit ? , ?';
        sqlParams = [key, key, offset, per_page]; 
    }else{
        sql = 'select ID, post_title, post_date from wp_posts order by post_date desc limit ? , ?';
        sqlParams = [offset, per_page];
    }
    connection.query(sql, sqlParams, function (err, posts) {
        callback(err, posts);
    });
};
exports.countPosts = function(key, callback){
    var sql;
    if(key){
        key = '%' + key + '%';
        sql = 'select count(*) as count from wp_posts p left join wp_users u on p.post_author = u.ID where p.post_title like "' + key + '" or u.user_login like "' + key + '"';
    }else{
        sql = 'select count(*) as count from wp_posts';
    }
    connection.query(sql, function (err, results) {
        callback(err, results[0].count);
    });
};
exports.getPostDetail =  function(id, callback){
    var sql = 'select post_title, post_content from wp_posts where ID = ' + id;
    connection.query(sql, function (err, posts) {
        callback(err, posts[0]);
    })
};
exports.delPost =  function(id, callback){
    var sql = 'delete from wp_posts where id = ' + id;
    connection.query(sql, function (err, result) {
        callback(err, result);
    });
};
exports.updatePost = function(post_title, post_title, callback){
    var sql = 'update wp_posts set post_title = ? where ID = ?';
    var sqlParams = [post_title, post_title];
    connection.query(sql, sqlParams, function (err, result) {
        callback(err, result);
    });
};
