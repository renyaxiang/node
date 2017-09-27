var connection = require('../common/db');
var auth = {
    authUser: function(req, res, next){
        // if(req.signedCookies.user){
        //     res.locals.current_user = req.signedCookies.user.username;
        // }
        
        if(req.session && req.session.user){
            res.locals.current_user = req.session.user.username
        }
        next();
    },

    /**
     * 方案一：通过cookie验证客户状态
     * 缺点：每次验证都要查询数据库
     */
    userRequiredByCookie: function(req, res, next){    
        var user = req.signedCookies.user;
        if(user){
            var sql = 'select * from wp_users where user_login = ? and user_pass = ?';
            var sqlParams = [user.username, user.password];
            connection.query(sql, sqlParams, function(err, results){
                if(err){
                    next(err);
                    return;
                }
                if(results.length > 0){
                    next();
                }else{
                    res.render('403',{
                        title: '禁止访问'
                    });
                }
            });
        }else{
            res.render('403',{
                title: '禁止访问'
            });
        }
    },

    /**
     * 方案二：通过session验证客户状态
     * 默认是将session存放在内存，对服务器的压力太大
     */
    userRequired: function(req, res, next){
        if(!req.session || !req.session.user || !req.session.user_id){
            return res.redirect('/login');
        }
        next();
    }
}

module.exports = auth;