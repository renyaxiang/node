/**
 * @author xiangry <xiangrenya@gmail.com>
 * @description wiki 服务
 * - 创建时间：2018-02-09
 * - 新增wiki
 * - 列表wiki
 * - 查看wiki
 * - 编辑wiki
 * - 删除wiki
 */

const uuidv4 = require('uuid/v4')
const conn = require('../common/mysql')

// 新增wiki
exports.add = ({ userId, title, content }) => {
  const sql = 'insert into wikis(pid, userId, title, content) value(?, ?, ?, ?)'
  const pid = uuidv4()
  const sqlParams = [pid, userId, title, content]
  return new Promise((resolve, reject) => {
    conn.query(sql, sqlParams, err => {
      if (err) reject(err)
      resolve(pid)
    })
  })
}
// 列表wiki
exports.list = key => {
  const sql = 'select * from wikis where 1 = 1 '
  if (key) {
    sql += 'and title like %?%'
  }
  const sqlParams = [key]
  return new Promise((resolve, reject) => {
    conn.query(sql, sqlParams, (err, datas) => {
      if (err) reject(err)
      resolve(datas)
    })
  })
}
// 查看wiki
exports.get = pid => {
  const sql = 'select * from wikis where pid = ?'
  const sqlParams = [pid]
  return new Promise((resolve, reject) => {
    conn.query(sql, sqlParams, (err, datas) => {
      if (err) reject(err)
      resolve(datas[0])
    })
  })
}
// 编辑wiki
exports.update = ({ pid, userId, title, content }) => {
  const sql = 'update wiki set userId = ?, title = ?, contnet = ? where pid = ?'
  const sqlParams = [pid, userId, title, content]
  return new Promise((resolve, reject) => {
    conn.query(sql, sqlParams, err => {
      if (err) reject(err)
      resolve(pid)
    })
  })
}
// 删除wiki
exports.del = pid => {
  const sql = 'delete from wikis where pid = ?'
  const sqlParams = [pid]
  return new Promise((resolve, reject) => {
    conn.query(sql, sqlParams, err => {
      if (err) reject(err)
      resolve()
    })
  })
}