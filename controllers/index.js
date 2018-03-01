/**
 * @author xiangry <xiangrenya@gmail.com>
 */

const GithubService = require('../services/github')
const UserService = require('../services/user')

exports.index = function (req, res, next) {
  const code = req.query.code
  if(!code) {
    return res.render('index', {
      title: '首页',
      words: '知识改变命运'
    })
  }
  GithubService.auth(code).then(g => {
    // 判断用户之前是否授权过
    GithubService.getUserDetailByGithubId(g.id).then((u) => {
      // 第一次授权
      if (!u) {
        // 添加github用户信息
        return GithubService.insertGitHub(g.id, g.name, g.token, g.avatar, g.email, g.intro).then((pid) => {
          req.session.currentUser = {
            userId: pid,
            nickName: gname,
            isAdmin: false
          }
        })
      } else {
        // 已授权过,同步github账号信息
        return GithubService.syncGithub(g.id, g.name, g.token).then(() => {
          req.session.currentUser = {
            userId: u.pid,
            nickName: g.name,
            isAdmin: u.status === 2
          }
        })
      }
    }).then(() => {
      res.locals.currentUser = req.session.currentUser
      res.render('index', {
        title: '首页',
        words: 'Hello World'
      })
    }).catch(err => {
      next(err)
    })
  })
}