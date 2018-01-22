/**
 * @author xiangry <xiangrenya@gmail.com>
 */
var util= require('util');
var request = require('superagent');
var expect = require('chai').expect;
var user = require('../api/user');
var config = require('../config');

var base_url = util.format('http://%s:%s/api', config.hostname, config.port);

describe('个人中心', function () {
    var account = {
        username: 'test',
        password: 'test.123',
        email: 'test@@qq.com'
    };

    var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXJfaWQiOiI3MGE1YzBlYi02YWJhLTQ4M2YtOGEwOS1iZGEyZjM5YTk3ZmMiLCJzdGF0dXMiOjJ9LCJpYXQiOjE1MDk2OTM3MDF9.MlhzVJVQ1BQ91kZOdmeVAB48w1s5AcLbOpUNe_ey0uc';

    describe('POST /api/signup', function () {
        it('用户注册-成功', function (done) {
            request.post(base_url + '/signup').send(account).end(function (err, res) {
                if (err) {
                    return done(err);
                }
                console.log(res.status);
                expect(res.status).to.equal(201);
                done();
            });
        });
        it('用户注册-请完善注册信息', function (done) {
            request.post(base_url + '/signup').send({}).end(function (err, res) {
                expect(err).to.not.be.null;
                expect(res.status).to.equal(400);           
                done();
            });
        });
        it('用户注册-用户名已存在', function (done) {
            request.post(base_url + '/signup').send(account).end(function (err, res) {
                expect(err).to.not.be.null;
                expect(res.status).to.equal(400);       
                done();
            });
        });
    });

    describe('POST /api/login', function () {
        it('用户登录-成功', function (done) {
            request.post(base_url + '/login').send({
                username: account.username,
                password: account.password
            }).end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.status).to.equal(200);
                expect(res.body).to.have.any.keys('user', 'token');
                done();
            });
        });
        it('用户登录-用户名或密码不能为空', function (done) {
            request.post(base_url + '/login').send({
                username: '',
                password: ''
            }).end(function (err, res) {
                expect(err).to.not.be.null;
                expect(res.status).to.equal(400);
                done();
            });
        });
        it('用户登录-用户名不存在', function (done) {
            request.post(base_url + '/login').send({
                username: (new Date()).getTime().toString(),
                password: account.password
            }).end(function (err, res) {
                expect(err).to.not.be.null;
                expect(res.status).to.equal(404);
                done();
            });
        });
        it('用户登录-密码错误', function (done) {
            request.post(base_url + '/login').send({
                username: account.username,
                password: (new Date()).getTime().toString()
            }).end(function (err, res) {
                expect(err).to.not.be.null;
                expect(err.status).to.equal(400);
                done();
            });
        });
    });

    after(function () {
        request.del(base_url + '/admin/users').set('Authorization', token).end(function (err, res) {
        });
    })
});