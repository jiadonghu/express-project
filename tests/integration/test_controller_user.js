// set env param as test 
process.env.NODE_ENV = 'test';

const Request     = require('request-promise');
const UserFixture = require('../fixtures/user');
const Should      = require('should');
const User        = require('../../models/user');
const Config      = require('../../config');

describe('Controller User', () => {

    let fixtures = {
        test_user_1 : UserFixture.RandomUser(),
    };

    let instance = {};

    before(done => {
        // start service
        let app = require('../../app');

        setTimeout(() => {
            done();
        }, 1000);
    });

    it('Post: /login should return 400 when params are invalid', async () => {

        let invalid_body = {
            email    : 'email',
            password : fixtures.test_user_1.password
        }

        let result = await Request({
            method  : 'POST',
            uri     : Config.api.url + 'login',
            headers : {
                'Content-Type' : 'application/json'
            },
            body                    : invalid_body,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(400);
        
    });

    it('Post: /login should return 404 when no user found', async () => {
        let result = await Request({
            method  : 'POST',
            uri     : Config.api.url + 'login',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : {
                email    : fixtures.test_user_1.email,
                password : fixtures.test_user_1.password
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(404);
    });

    it('Post: /register should return 400 when params are invalid', async () => {
        let invalid_body = {
            email    : fixtures.test_user_1.email,
            password : fixtures.test_user_1.password
        };

        let result = await Request({
            method  : 'POST',
            uri     : Config.api.url + 'register',
            headers : {
                'Content-Type' : 'application/json'
            },
            body                    : invalid_body,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(400);
    });

    it('Post: /register should return jwt token', async () => {
       
        let result = await Request({
            method  : 'POST',
            uri     : Config.api.url + 'register',
            headers : {
                'Content-Type' : 'application/json'
            },
            body                    : fixtures.test_user_1,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(201);
        Should.exist(result.body.token);
    });

    it('Post: /register should return 409 when email already exist', async () => {
       
        let result = await Request({
            method  : 'POST',
            uri     : Config.api.url + 'register',
            headers : {
                'Content-Type' : 'application/json'
            },
            body                    : fixtures.test_user_1,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(409);
    });

    it('Post: /login should return 401 when password is incorrect', async () => {
        let result = await Request({
            method  : 'POST',
            uri     : Config.api.url + 'login',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : {
                email    : fixtures.test_user_1.email,
                password : fixtures.test_user_1.password + 'incorrect'
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(401);
    });

    it('Post: /login should return jwt token', async () => {
        let result = await Request({
            method  : 'POST',
            uri     : Config.api.url + 'login',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : {
                email    : fixtures.test_user_1.email,
                password : fixtures.test_user_1.password
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(200);
        Should.exist(result.body.token);
        fixtures.token = result.body.token;
    });

    it('Get: /user/:user_id should return 400 when params are invalid', async () => {
        let invalid_id = 'fake_id';
        let result = await Request({
            method  : 'GET',
            uri     : Config.api.url + 'user/' + invalid_id,
            headers : {
                'Content-Type'  : 'application/json',
                'authorization' : 'Bearer ' + fixtures.token
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(400);
    });

    it('Get: /user/:user_id should return user', async () => {

        let user = await User.findOne({
            where : { email: fixtures.test_user_1.email }
        });

        instance.user = user;
       
        let result = await Request({
            method  : 'GET',
            uri     : Config.api.url + 'user/' + user.id,
            headers : {
                'Content-Type'  : 'application/json',
                'authorization' : 'Bearer ' + fixtures.token
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(200);
        result.body.email.should.equal(user.email);
        result.body.id.should.equal(user.id)
    });

    it('Get: /user/:user_id should return 401 when token is invalid', async () => {
        let invalid_id = 'fake_id';
        let result = await Request({
            method  : 'GET',
            uri     : Config.api.url + 'user/' + invalid_id,
            headers : {
                'Content-Type'  : 'application/json',
                'authorization' : 'Bearer ' + 'token'
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(401);
    });

    it('Get: /user/:user_id should return 404 when user is not found', async () => {

        // remove user
        instance.user.destroy();

        let result = await Request({
            method  : 'GET',
            uri     : Config.api.url + 'user/' + instance.user.id,
            headers : {
                'Content-Type'  : 'application/json',
                'authorization' : 'Bearer ' + fixtures.token
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(404);
    });

    after(async () => {

        // in case it failed to delete
        let user = await User.findOne({
            where : { email: fixtures.test_user_1.email }
        });

        if (user) {
            await user.destroy();
        }

    });
});
