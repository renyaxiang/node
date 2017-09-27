# Node

### 目录

1. 环境安装
2. 技术选型
3. 参考资料

### 环境安装

- [Node](http://nodejs.cn)
- [MySQL](https://www.mysql.com)
- [Redis](https://redis.io)
- [Git](https://git-scm.com)
- [VSCode](https://code.visualstudio.com)
- [Navicat for MySQL](http://pan.baidu.com/s/1gfgoIUB)
- [Redis-Desktop-Manager](http://pan.baidu.com/s/1jHFeS9C)
- [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=zh-CN)
- [Source Code Pro](https://github.com/adobe-fonts/source-code-pro)

### 技术选型 

- UI
    - [bootstrap](http://www.bootcss.com)
    - [themes](https://bootswatch.com])

- Web
    - [express](http://www.expressjs.com.cn)

- MySQL
    - [mysqljs](https://github.com/mysqljs/mysql)

- View
    - [ejs-mate](https://github.com/JacksonTian/ejs-mate)

- Middlewares
    - [body-parser](https://github.com/expressjs/body-parser)
    - [cookie-parser](https://github.com/expressjs/cookie-parser)
    - [errorhandler](https://github.com/expressjs/errorhandler)
    - [connect-redis](https://github.com/tj/connect-redis)
    - [helmet](https://github.com/helmetjs/helmet)

- Utils：
    - [eventproxy](https://github.com/JacksonTian/eventproxy)
    - [log4js](https://github.com/nomiddlename/log4js-node)
    - [moment](http://momentjs.cn)

- Server
    - [supervisor](https://github.com/petruisfan/node-supervisor)
    - [pm2](https://github.com/Unitech/PM2)

### 快速启动项目

1、安装package.json里的项目依赖文件
``` bash
cnpm install
```
2、启动redis服务
```
redis-server
```
2、启动mysql服务

打开系统偏好设置中MySQL，启动服务

3、启动应用
``` bash
node app
```
4、产线部署
``` bash
pm2 start app.js
```

### 参考资料

#### 书籍

- 《深入浅出Node.js》朴灵
