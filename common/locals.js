const moment = require('moment');
moment.locale('zh-cn');

module.exports = app => {
    app.locals = {
        ...app.locals,
        user: null,
        dateFormat(date, formatStr = 'YYYY-MM-DD hh:mm') {
            return moment(date).format(formatStr);
        },
        defautAvatar(avatar) {
            return avatar || '/images/default/avatar.jpg';
        },
        fromNow(date) {
            return moment(date).fromNow();
        }
    };
};
