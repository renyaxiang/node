module.exports = {
  name: "一个完整的 Express 项目",
  hostname: "127.0.0.1",
  port: 3000,
  debug: true,

  cookie_screct: "abc123",
  jwt_secret: "abc456",

  mysql_host: "127.0.0.1",
  mysql_port: 3306,
  mysql_user: "admin",
  mysql_password: "admin.123",
  mysql_db: "iME",

  redis_host: "127.0.0.1",
  redis_port: 6379,
  redis_db: 0,
  redis_password: "abc123",

  mail_opts: {
    host: "smtp.163.com",
    port: 25,
    auth: {
      user: "xxxxxx@163.com",
      pass: "xxxxxx"
    },
    ignoreTLS: true
  },
  github_client_id: "",
  github_client_secret: "",
  scope: ['user', 'repo', 'gist']
};
