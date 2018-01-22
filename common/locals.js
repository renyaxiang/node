/**
 * @author xiangry <xiangrenya@gmail.com>
 * 模板中的帮助方法
    - 时间格式化
 */
const moment = require('moment')
moment.locale('zh-cn')
module.exports = function (app) {
    app.locals.dateFormat = function (date, formatStr = 'YYYY-MM-DD hh:mm') {
        return moment(date).format(formatStr)
    }
    app.locals.fromNow = function (date) {
        return moment(date).fromNow()
    }
}