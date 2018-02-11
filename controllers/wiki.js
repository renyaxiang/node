/**
 * @author xiangry <xiangrenya@gmail.com>
 * @description wiki控制器
 * - 创建时间：2018-02-09
 * - 显示接口文档
 */

 const util = require('../common/utils')
 const wikiService = require('../services/wiki')

// 显示wiki首页
exports.index = function (req, res) {
  res.render('wiki/index', {
    title: 'wiki首页'
  })
}

// 显示新增wiki
exports.showAdd = function (req, res) {
  res.render('wiki/add', {
      title: '新增wiki'
  })
}

// 新增wiki
exports.add = function (req, res, next) {
  const {title, content} = util.normalizeObj(req.body)
  const userId = req.session.currentUser.userId
  wikiService.add({userId, title, content}).then(pid => {
    res.redirect('/wikis')
  }).catch(err => {
    next(err)
  })
}

// 显示wiki详情
exports.get = function (req, res, next) {
  const {title, content} = util.normalizeObj(req.body)
  const userId = req.session.currentUser.useId
  const pid = req.params.id
  wikiService.get(pid).then(wiki => {
    res.render('wiki/detail', {
      wiki
    })
  }).catch(err => {
    next(err)
  })
}