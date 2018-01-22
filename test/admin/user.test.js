/**
 * @author xiangry <xiangrenya@gmail.com>
 */
var request = require('superagent');
var expect = require('chai').expect;
var util = require('util');
var config = require('../../config');
var user = require('../../api/user');

var base_url = util.format('http://%s:%s/api', config.hostname, config.port);

var user_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXJfaWQiOiI0NzUxMjM4Ny1lNWY3LTQyNjUtOWUzNy1kM2NlYmI2OGVmY2QiLCJzdGF0dXMiOjF9LCJpYXQiOjE1MDk2OTc5OTN9.QvF1xUQ_iEcvF7NdokSkuopLg6D6cI0rTZTy7veGhS4';
var amdin_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXJfaWQiOiI3MGE1YzBlYi02YWJhLTQ4M2YtOGEwOS1iZGEyZjM5YTk3ZmMiLCJzdGF0dXMiOjJ9LCJpYXQiOjE1MDk2OTM3MDF9.MlhzVJVQ1BQ91kZOdmeVAB48w1s5AcLbOpUNe_ey0uc';

describe('用户管理', function () {
    var account = {
        username: 'admin'
    };
    describe('POST /api/admin/users', function () {
        it('查询用户列表-未设置Authorization', function (done) {
            request.post(base_url + '/admin/users').end(function (err, res) {
                expect(err).to.not.be.null;
                expect(err.status).to.equal(401);
                done();
            });
        });
        it('查询用户列表-无效的Token', function (done) {
            request.post(base_url + '/admin/users').set('Authorization', 'xxx.yyy.zzz').end(function (err, res) {
                expect(err).to.not.be.null;
                expect(err.status).to.equal(401);
                done();
            });
        });
        it('查询用户列表-普通用户无权限访问', function (done) {
            request.post(base_url + '/admin/users').set('Authorization', user_token).end(function (err, res) {
                expect(err).to.not.be.null;
                expect(err.status).to.equal(403);
                done();
            });
        });
        it('查询用户列表-默认', function (done) {
            request.post(base_url + '/admin/users').set('Authorization', amdin_token).end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.status).to.equal(200);
                expect(res.body.users).to.be.an('array');
                done();
            });
        });
        it('查询用户列表-模糊查询用户名', function (done) {
            request.post(base_url + '/admin/users').send({
                username: account.username
            }).set('Authorization', amdin_token).end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.status).to.equal(200);
                expect(res.body.users).to.be.an('array');
                done();
            });
        });
        it('查询用户列表-带分页参数', function (done) {
            request.post(base_url + '/admin/users?page=2&per_page=3').set('Authorization', amdin_token).end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.status).to.equal(200);
                expect(res.body).to.have.any.keys('users', 'current_page', 'total_count');
                expect(res.body.current_page).to.equal(2);
                done();
            });
        });
    });

    describe('PUT /api/admin/users/:id/:status', function (done) {
        it('更改用户状态', function (done) {
            request.put(base_url + '/admin//users/70a5c0eb-6aba-483f-8a09-bda2f39a97fc/2').set('Authorization', amdin_token).end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.status).to.equal(201);
                done();
            });
        });
    });
});