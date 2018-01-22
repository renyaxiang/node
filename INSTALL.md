## 第 1 章 环境和工具安装

- [Node](http://nodejs.cn)
- [MySQL](https://www.mysql.com)
- [Redis](https://redis.io)
- [Git](https://git-scm.com)
- [VSCode](https://code.visualstudio.com)
- [Navicat for MySQL](http://pan.baidu.com/s/1gfgoIUB)
- [Redis-Desktop-Manager](http://pan.baidu.com/s/1jHFeS9C)
- [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=zh-CN)

### 快速启动项目

- 安装package.json里的项目依赖包 


``` bash
cnpm install

```
步骤2：启动redis服务

```
redis-server
```

步骤3：启动mysql服务

打开系统偏好设置中MySQL，启动服务

步骤4：启动应用

``` bash
npm run dev
```