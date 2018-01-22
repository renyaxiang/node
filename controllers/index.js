/**
 * @author xiangry <xiangrenya@gmail.com>
 */

const GithubService = require('../services/github')
const UserService = require('../services/user')

exports.index = function (req, res, next) {
  const code = req.query.code
  if (code) {
    GithubService.auth(code).then(github => {
      const githubId = github.id
      const githubUserName = github.userName
      const githubAccessToken = github.accessToken
      const githubAvatarUrl = github.avatarUrl
      const githubEmail = github.email
      const githubIntro = github.intro

      // 判断用户之前是否授权过
      GithubService.getUserDetailByGithubId(githubId).then((user) => {
        // 已授权过
        if (user) {
          // 同步github账号信息
          GithubService.syncGithub(githubId, githubUserName, githubAccessToken).then(() => {
            req.session.currentUser = {
              userId: user.pid,
              nickName: githubUserName,
              isAdmin: user.status === 2
            }
            renderPage(res)
          }).catch(err => {
            next(err)
          })
        } else { // 第一次授权
          // 添加github用户信息
          GithubService.registerByGithub(githubId, githubUserName, githubAccessToken, githubAvatarUrl, githubEmail, githubIntro).then(() => {
            // 查看插入后的用户id
            GithubService.getUserDetailByGithubId(githubId).then((user) => {
              req.session.currentUser = {
                userId: user.pid,
                nickName: user.nickname,
                isAdmin: false
              }
              renderPage(res)
            }).catch(err => {
              next(err)
            })
          }).catch(err => {
            next(err)
          })
        }
      }).catch(err => {
        next(err)
      })
    })
  } else {
    renderPage(res)
  }
}


function renderPage(res) {
  res.render('index', {
    title: '首页',
    words: 'Hello World'
  })
}