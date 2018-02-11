/**
 * @author xiangry <xiangrenya@gmail.com>
 * 模板中的帮助方法
    - 时间格式化
    - 默认头像
 */

const moment = require('moment')
moment.locale('zh-cn')

module.exports =  app => {
    app.locals.dateFormat = (date, formatStr = 'YYYY-MM-DD hh:mm') => moment(date).format(formatStr)
    app.locals.fromNow = date => moment(date).fromNow()
    app.locals.defautAvatar = avatar => avatar || '/images/default/avatar.jpg'
}