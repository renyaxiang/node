/**
 * @author xiangry <xiangrenya@gmail.com>
 */

var restify = require('restify');
var server = restify.createServer({
  'content-type': 'application/json'
});

var jwtAuth = require('./middlewares/jwt-auth');
var isAdmin = require('./middlewares/admin');
var config = require('./config');

var userAdmin = require('./api/admin/user');

var user = require('./api/user');
var post = require('./api/post');

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.use(jwtAuth({
  secret: config.jwt_secret,
  whitelist: ['/api/login', '/api/signup']
}));

server.use(isAdmin);

// signup | login
server.post('/api/signup', user.signup);
server.post('/api/login', user.login);

// admin
server.post('/api/admin/users', userAdmin.getUserList);
server.put('/api/admin/users/:id/:status', userAdmin.changeUserStatus);
server.del('/api/admin/users/:id', userAdmin.deleteUser);
server.del('/api/admin/users/', userAdmin.deleteUsers);

// user
server.get('/api/user', user.getUserProfile);
server.put('/api/user', user.updateUserProfile);
server.put('/api/user/changeUserPassword', user.changeUserPassowrd);

// post
server.post('/api/posts', post.getPostList);
server.post('/api/post', post.addPost);
server.get('/api/posts/:id/', post.getPostDetail);
server.put('/api/posts/:id/', post.updatePost);
server.del('/api/posts/:id/', post.deletePost);

server.on('restifyError', function(req, res, err, callback) {
  console.log(err);
  return callback();
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});