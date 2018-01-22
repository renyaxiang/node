/**
 * @author xiangry <xiangrenya@gmail.com>
 * 数据库服务列表
    - 文章列表查询
    - 文章数目统计
    - 新增文章
    - 查看文章详情
    - 更新文章内容
    - 删除文章
 */

const conn = require('../common/mysql')
const uuidv4 = require('uuid/v4')
const utils = require('../common/utils')

/**
 * 查看文章列表，包括分页、模糊查询
 * @param {Number} page 第几页
 * @param {Number} perPage 每页显示的数量
 * @param {String} title 标题
 * @returns {Promise}
 */
exports.getPostList = function (userId, title, page, perPage) {
    let sql = 'select  p.pid, u.username, u.avatarUrl, p.title, p.content, p.updateDate from posts p left join users u on p.userId = u.pid where 1 = 1 '
    let sqlParams = []    
    if(userId){
        sql += 'and p.userId = ? '
        sqlParams.push(userId)
    }
    if(title){
        sql += 'and p.title like ? '
        sqlParams.push('%' + title + '%')
    }
    sql += 'order by p.updateDate desc limit ?, ?'
    sqlParams.push((page - 1) * perPage, perPage)

    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if(err){
                reject(err)
            }else{
                resolve(datas)
            }
        })
    })
    
}

/**
 * 统计某用户下的文章数，带标题查询
 * @param {String} userId 用户ID
 * @param {String} title 标题
 * @returns {Promise}
 */
exports.countPosts = function (userId, title) {
    let sql = 'select count(pid) as count from posts where 1 = 1 '
    let sqlParams = []    
    if(userId){
        sql += 'and userId = ? '
        sqlParams.push(userId)
    }
    if(title){
        sql += 'and title like ? '
        sqlParams.push('%' + title + '%')
    }

    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if(err){
                reject(err)
            }else{
                resolve(datas[0].count)
            }
        })
    })
}

/**
 * 新增文章
 * @param {String} userId 用户id
 * @param {String} categoryId 分类
 * @param {String} title 标题
 * @param {String} content 正文
 * @returns {Promise}
 */
exports.addPost = function (userId, categoryId, title, content) {
    const sql = 'insert into posts(pid, userId, categoryId, title, content) values(?, ?, ?, ?, ?)'
    const pid = uuidv4()
    const sqlParams = [pid, userId, categoryId, title, content]

    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if(err){
                reject(err)
            }else{
                resolve(pid)
            }
        })
    })
}

/**
 * 获取文章详情
 * @param {String} pid 文章id
 * @returns {Promise}
 */
exports.getPostDetail = function (pid) {
    const sql = 'select  u.username, u.avatarUrl, p.title, p.content, p.updateDate from posts p left join users u on p.userId = u.pid where p.pid = ?'
    const sqlParams = [pid]

    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if(err){
                reject(err)
            }else{
                resolve(datas[0])
            }
        })
    })
}

/**
 * 修改文章基本信息
 * @param {String} pid 博客id
 * @param {String} title 标题
 * @param {String} content 正文
 * @param {String} cateogryId 分类
 * @returns {Promise}
 */
exports.updatePost = function (pid, title, content, cateogryId) {
    const sql = 'update posts set title = ?, content = ?, cateogryId = ? where pid = ?'
    const sqlParams = [title, content, cateogryId, pid]

    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if(err){
                reject(err)
            }else{
                resolve(datas)
            }
        })
    })
}

/**
 * 删除某篇文章
 * @param {String} pid 文章id
 * @returns {Promise}
 */
exports.deletePost = function (pid) {
    const sql = 'delete from posts where pid = ?'
    const sqlParams = [id]

    return new Promise((resolve, reject) => {
        conn.query(sql, sqlParams, (err, datas) => {
            if(err){
                reject(err)
            }else{
                resolve(datas)
            }
        })
    })
}