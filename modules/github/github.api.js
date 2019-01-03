const GithubService = require('./github.service');
const utils = require('../common/utils');

exports.login = (req, res, next) => {
    const url = GithubService.getAuthorizationUrl();
    res.send(url);
};

exports.info = (req, res, next) => {
    const code = req.params.code;
    try {
        const githubInfo = GithubService.getGithubInfoByCode(code);
        res.send(githubInfo);
    } catch (err) {
        next(err);
    }
};

exports.oauth = async (req, res, next) => {
    const code = req.params.code;
    try {
        const {
            login,
            avatar_url,
            email,
            bio
        } = GithubService.getGithubInfoByCode(code);
        const user = {
            nickname: login,
            avatar: avatar_url,
            email,
            intro: bio
        };
        const user = await GithubService.getUser(user.nickname);
        let userId;
        if (user) {
            userId = user.pid;
            await GithubService.update(user);
        } else {
            userId = await GithubService.addUser(user);
        }
        const token = utils.signToken({
            userId,
            status: data.status
        });
        res.send({
            ...user,
            token
        });
    } catch (err) {
        next(err);
    }
};
