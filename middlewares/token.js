var jwt = require('jsonwebtoken');
var errors = require('restify-errors');

module.exports = function jwtAuthMiddleware(options) {

    var middleware = function (req, res, next) {
        if (options.whitelist && options.whitelist.indexOf(req.getPath()) !== -1) {
            return next()
        }
        var credentials = req.headers.authorization || req.query.token;
        if (credentials) {
            jwt.verify(credentials, options.secret, function (err, decoded) {
                if (err) {
                    return next(new errors.UnauthorizedError(err.message));
                }
                req.payload = decoded.payload;
                return next();
            });
        } else {
            return next(new errors.BadRequestError('请设置请求headers中Authorization'));
        }
    }
    return middleware;
}