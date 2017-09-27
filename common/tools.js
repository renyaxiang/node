var crypto = require('crypto');
var tools = {
    encryptPassword: function(pwd){
        var hash = crypto.createHash('md5');
        hash.update(pwd);
        return hash.digest('hex');
    }
}

module.exports = tools;