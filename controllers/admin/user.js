/**
 * @author xiangry <xiangrenya.gmail.com>
 */

const UserService = require('../../services/user')
const config = require('../../config')

// 查询列表：分页、模糊查询
exports.getList = function (req, res, next) {
    let { username = '', page = 1, perPage = 20 } = req.query
    page = parseInt(page)
    perPage = parseInt(perPage)

    const usersPromise = new Promise((resolve, reject) => {
        UserService.getList(page, perPage, username).then(datas => {
            resolve(datas)
        })
    })

    const countPromise = new Promise((resolve, reject) => {
        UserService.count(username).then(data => {
            resolve(data)
        })
    })

    Promise.all([usersPromise, countPromise]).then(([users, count]) => {
        res.render('admin/user', {
            title: '用户列表',
            users: users,
            currentPage: page,
            perPage: perPage,
            pages: Math.ceil(count/10),
            key: key
        })
    }).catch(err => {
        next(err)
    })
}