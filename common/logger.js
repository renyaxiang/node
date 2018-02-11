/**
 * @author xiangry <xiangrenya@gmail.com>
 * @description 后台异常日志管理
 */
const log4js = require('log4js')

log4js.configure({
    appenders: {
        cheeseLogs: { type: 'file', filename: 'logs/cheese.log' },
        console: { type: 'console' }
    },
    categories: {
        default: { appenders: ['console'], level: 'trace' },
        cheese: { appenders: ['cheeseLogs'], level: 'error' },
    }
})

const logger = log4js.getLogger('cheeseLogs')

module.exports = logger