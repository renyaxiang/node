/**
 * @author xiangry <xiangrenya@gmail.com>
 * 
 * Session Stores方案。缺点：占用你服务器的性能
 * 默认：内存MemoryStore。缺点：重启服务，所有的Session Data数据就回丢失，无法实现持久化存储
 * 数据库存储：mysql || mongodb。缺点：Session Data只能存储在单一服务器上，无法实现分布式存储
 * 分布式缓存存储：redis
 */

const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
// const RedisStore = require('connect-redis')(session)
const config = require('../config')

// mysql store
const mysqlStore = new MySQLStore({
  host: config.mysql_host,
  port: config.mysql_port,
  user: config.mysql_user,
  password: config.mysql_password,
  database: config.mysql_db
})

// redis store
// const redisStore = new RedisStore({
//   port: config.redis_port,
//   host: config.redis_host,
//   db: config.redis_db,
//   pass: config.redis_password,
//   logErrors: true
// })

function setSession(store) {
  return session({
    store: store,
    secret: config.cookie_screct,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 1 },
    resave: false,
    rolling: true,
    saveUninitialized: false
  })
}

exports.mysqlSession = setSession(mysqlStore)
// exports.redisSession = setSession(redisStore)

