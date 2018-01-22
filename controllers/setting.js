/**
 * @author xiangry <xiangrenya@gmail.com>
 */

exports.index = function(req, res){
    res.render('setting', {
        title: '个人设置'
    });
};