var conn = require('../../common/db_spiders');
var uuidv4 = require('uuid/v4');

// CNode Post
exports.addPost = function(author, title, content, cb){
    var sql = 'insert into core_blog(author, title, content) values(?, ?, ?)';
    var sqlParams = [author, title, content];
    conn.query(sql, sqlParams, function (err, result) {
        callback(err, result);
    });
};
// 众包
exports.addZb = function(project, category, status, amt, skill, mode, create_at, cb){
    var sql = 'insert into zbs(id, project, category, status, amt, skill, mode, create_at) values(?, ?, ?, ?, ?, ?, ?, ?)';
    var sqlParams = [uuidv4(), project, category, status, amt, skill, mode, create_at];
    conn.query(sql, sqlParams, function (err, result) {   
        cb(err, result);
    });
};