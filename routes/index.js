/**
 * Created by xiangry on 2016/12/9.
 */

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {
            title: '首页',
            animals: ['dog', 'cat', 'sheep', 'wolf']
        });
    });
};
