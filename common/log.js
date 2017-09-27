var log4js = require('log4js');
log4js.configure({
    appenders: {
        cheeseLogs: { type: 'file', filename: 'logs/cheese.log' },
        console: { type: 'console' }
    },
    categories: {
        default: { appenders: ['console'], level: 'trace' },
        cheese: { appenders: ['cheeseLogs'], level: 'error' },
    }
});

var logger = log4js.getLogger('default');

// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Gouda.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');

module.exports = logger;