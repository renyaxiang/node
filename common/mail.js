/**
 * @author xiangry <xiangrenya@gmail.com>
 */

var util = require('util');
var mailer = require('nodemailer');

var config = require('../config');
var message = {
    from: util.format('%s <%s>', config.name, config.mail_opts.auth.user),
    to: '1399020825@qq.com',
    subject: '图片欣赏',
    html: '<p>HTML version of the message</p><br><a href="https://www.baidu.com">查看报告</a>',
    attachments: [
        {
            filename: 'error.log',
            path: './logs/cheese.log'
        },{
            filename: 'image.jpg',
            path: 'http://a.hiphotos.baidu.com/image/pic/item/503d269759ee3d6d453aab8b48166d224e4adef5.jpg'
        }
    ]
};
var transporter = mailer.createTransport(config.mail_opts);

transporter.sendMail(message, function (err, info) {
    if (err) {
        return console.log(err);
    }
    console.log('邮件已发送至：' + message.to);
    
});

exports.sendMail = function(message){
    transporter.sendMail(message, function (err, info) {
        if (err) {
            return console.log(err);
        }
        console.log('邮件已发送至：' + message.to);
    });
}