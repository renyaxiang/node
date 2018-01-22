/**
 * @author xiangry <xiangrenya@gmail.com>
 */

exports.index = function (req, res) {
  res.render('api', {
      title: '接口'
  })
}