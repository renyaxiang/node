const GithubService = require('./github.service');
const utils = require('../../common/utils');

exports.login = (req, res, next) => {
    const url = GithubService.getAuthorizationUrl();
    res.send({
        result: true,
        data: {
            url
        }
    });
};

exports.info = async (req, res, next) => {
    const code = req.params.code;
    try {
        const { data } = await GithubService.getGithubInfoByCode(code);
        res.send({
            result: true,
            data
        });
    } catch (err) {
        next(err);
    }
};

exports.oauth = async (req, res, next) => {
    const code = req.params.code;
    try {
        const { data } = await GithubService.getGithubInfoByCode(code);
        const { name, avatar_url, email, bio } = data;
        const syncUser = {
            nickname: name,
            avatar: avatar_url,
            email,
            intro: bio
        };
        const user = await GithubService.getUser(name);
        let userId;
        if (user) {
            userId = user.id;
            await GithubService.updateUser(syncUser);
        } else {
            userId = await GithubService.addUser(syncUser);
        }

        const token = utils.signToken({
            userId,
            role: 0
        });
        res.send({
            result: true,
            data: {
                userId,
                role: 0,
                ...syncUser,
                token
            }
        });
    } catch (err) {
        next(err);
    }
};
