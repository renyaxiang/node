/**
 * @author xiangry <xiangrenya@gmail.com>
 */

const express = require('express')
const bodyParser = require('body-parser')
const errorhandler = require('errorhandler')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const app = express()

const config = require('./config')
const logger = require('./common/logger')
const mysqlSession = require('./middlewares/session').mysqlSession
const apiRouter = require('./api_router')
const apiAdminRouter = require('./api_admin_router')
const webRouter = require('./web_router')

// 视图引擎
app.set('views', './views')
app.set('view engine', 'html')
app.engine('html', require('ejs-mate'))
app.locals._layoutFile = 'layout.html'

// 模板中的帮助方法
require('./common/locals')(app)

// 中间件
app.use(express.static('public'))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())

// 会话管理
app.use(cookieParser(config.cookie_screct))
app.use(mysqlSession)

// 路由管理
app.use('/api/v1', apiRouter)
app.use('/api/admin', apiAdminRouter)
app.use('/', webRouter)

app.use((req, res, next) => {
    app.locals.currentUser = req.session.currentUser || null
    next()
})

// const env = process.env.NODE_ENV ||  'dev'
// if(env == 'dev'){   
//     app.use(errorhandler())
// }else{
//     app.use(function(err, req, res, next){
//         logger.error(err)
//         res.status(500).send(err.message)
//     })
// }

// 异常处理
app.use(function (err, req, res, next) {
    if (['TokenExpiredError', 'JsonWebTokenError'].indexOf(err.name) != -1) {
        if (req.xhr) {
            res.status(401).send(err)
        } else {
            res.render('error', {
                title: '无权限访问该页面',
                msg: '无权限访问该页面'
            })
        }
    } else {
        if (req.xhr) {
            res.status(500).send(err)
        } else {
            res.render('error', {
                title: '服务器内部错误',
                msg: err
            })
        }
    }
    logger.error(err)
})

// 404页面
app.get('*', function (req, res) {
    res.render('error', {
        title: '页面未找到',
        msg: '页面未找到'
    })
})

// 启动服务
app.listen(config.port, function (err) {
    if (err) {
        logger.error(err)
    } else {
        console.log('server is running on ' + config.hostname + ':' + config.port)
    }
})
