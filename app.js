// config 
var config = require('./config');

// framework
var express = require('express');
var app = express();

app.set('views', './views');
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = 'layout.html';

// middlewares
app.use(express.static('public'));
app.use(express.static('logs'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 跨站脚本攻击、点击劫持（xss protection and clickjacking）
var helmet = require('helmet');
app.use(helmet());

var errorhandler = require('errorhandler');
var cookieParser = require('cookie-parser');
app.use(cookieParser(config.cookie_screct));
var session = require('express-session');
/**
 * Session Stores方案。缺点：占用你服务器的性能
 * 默认：内存MemoryStore。缺点：重启服务，所有的Session Data数据就回丢失，无法实现持久化存储
 * 数据库存储：mysql || mongodb。缺点：Session Data只能存储在单一服务器上，无法实现分布式存储
 * 分布式缓存存储：redis
 */ 

//  方案一：数据库存储
var MySQLStore = require('express-mysql-session')(session);
var mysql_options = {
	host: config.mysql_host,
    port: config.mysql_port,
    user: config.mysql_user,
    password: config.mysql_password, 
    database: config.mysql_db
};
var sessionMySQLStore = new MySQLStore(mysql_options);
// 方案二：redis存储
var RedisStore = require('connect-redis')(session);
var redis_options = {
    port: config.redis_port,
    host: config.redis_host,
    db: config.redis_db,
    pass: config.redis_password,
    logErrors: true
};
var sessionRedisStore = new RedisStore(redis_options);

app.use(session({
    store: sessionRedisStore,
    secret: config.cookie_screct, 
    cookie: ('name', 'user', { path: '/', httpOnly: true,secure: false, maxAge:  1000 * 60 * 60 * 2 }),
    //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
    resave: true, 
    //强制“未初始化”的会话保存到存储
    saveUninitialized: true
}));

var auth = require('./middlewares/auth');
app.use(auth.authUser);

// utils
var logger = require('./common/log');
var moment = require('moment');
moment.locale('zh-cn');
app.locals.dateFormat = function (date, formatStr, friendly) {
    var ret;
    if (formatStr === undefined) {
        ret = moment(date).format('YYYY-MM-DD hh:mm');
    } else {
        if (friendly) {
            ret = moment(date).fromNow();
        } else {
            ret = moment(date).format(formatStr);
        }
    }
    return ret;
}

// routers
var apiRouter = require('./api-router');
app.use('/api/v1', apiRouter);

var webRouter = require('./web-router');
app.use('/', webRouter);

if(config.debug){   
    app.use(errorhandler());
}else{
    app.use(function(err, req, res, next){
        logger.error(err);
        res.status(500).send('500 status');
    });
}
app.get('*', function(req, res){
    res.render('404', {
        title: '页面未找到'
    });
});

// start application
app.listen(3000, function (err) {
    if (err) {
        logger.error(err);
    } else {
        logger.info('server is running on 127.0.0.1:3000 ...');
    }
});
