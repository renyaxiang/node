/**
 * @author xiangry <xiangrenya@gmail.com>
 */

const EventProxy = require('eventproxy')
const utils = require('../common/utils')
const UserService = require('../services/user')


exports.index= function (req, res) {
    UserService.getUserDetail(req.session.currentUser.userId).then(user => {
      res.render('my', {
        title: '个人中心',
        user: user
      })
    }).catch(err => {
      next(err)
    })
}