/**
 * @author xiangry <xiangrenya@gmail.com>
 * api列表
    - 授权Github
    - 获取令牌
 */

const GithubService = require('../services/github')
const utils = require('../common/utils')


// 通过授权码等流程获取github账号信息
exports.auth = function (req, res, next) {
    const code = req.params.code
    GithubService.auth(code).then(github => {
        res.send(github)
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: '授权失败'
        })
    })
}

// 获取令牌
exports.token = function(req, res, next){
    const githubId = req.params.githubId
    GithubService.getUserDetailByGithubId(githubId).then(user => {
        const token = utils.signToken({
            userId: user.pid,
            status: user.status
        })
        res.send(token)
    }).catch(err => {
        next(err)
    })
}