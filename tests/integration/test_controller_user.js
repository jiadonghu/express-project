// set env param as test 
process.env.NODE_ENV = 'test';

const request       = require('request-promise');
const {userFixture} = require('../fixtures');
const should        = require('should');
const {User}        = require('../../models');
const config        = require('../../config');

describe('Controller User', () => {

    let fixtures = {
        testUser1 : userFixture.random()
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

        let invalidBody = {
            email    : 'email',
            password : fixtures.testUser1.password
        }

        let result = await request({
            method  : 'POST',
            uri     : config.api.url + 'login',
            headers : {
                'Content-Type' : 'application/json'
            },
            body                    : invalidBody,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(400);
        
    });

    it('Post: /login should return 404 when no user found', async () => {
        let result = await request({
            method  : 'POST',
            uri     : config.api.url + 'login',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : {
                email    : fixtures.testUser1.email,
                password : fixtures.testUser1.password
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(404);
    });

    it('Post: /register should return 400 when params are invalid', async () => {
        let invalidBody = {
            email    : fixtures.testUser1.email,
            password : fixtures.testUser1.password
        };

        let result = await request({
            method  : 'POST',
            uri     : config.api.url + 'register',
            headers : {
                'Content-Type' : 'application/json'
            },
            body                    : invalidBody,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(400);
    });

    it('Post: /register should return jwt token', async () => {
       
        let result = await request({
            method  : 'POST',
            uri     : config.api.url + 'register',
            headers : {
                'Content-Type' : 'application/json'
            },
            body                    : fixtures.testUser1,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(201);
        should.exist(result.body.token);
    });

    it('Post: /register should return 409 when email already exist', async () => {
       
        let result = await request({
            method  : 'POST',
            uri     : config.api.url + 'register',
            headers : {
                'Content-Type' : 'application/json'
            },
            body                    : fixtures.testUser1,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(409);
    });

    it('Post: /login should return 401 when password is incorrect', async () => {
        let result = await request({
            method  : 'POST',
            uri     : config.api.url + 'login',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : {
                email    : fixtures.testUser1.email,
                password : fixtures.testUser1.password + 'incorrect'
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(401);
    });

    it('Post: /login should return jwt token', async () => {
        let result = await request({
            method  : 'POST',
            uri     : config.api.url + 'login',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : {
                email    : fixtures.testUser1.email,
                password : fixtures.testUser1.password
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(200);
        should.exist(result.body.token);
        fixtures.token = result.body.token;
    });

    it('Get: /user/:id should return 400 when params are invalid', async () => {
        let invalidId = 'fake_id';
        let result = await request({
            method  : 'GET',
            uri     : config.api.url + 'user/' + invalidId,
            headers : {
                'Content-Type'  : 'application/json',
                'authorization' :  fixtures.token
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(400);
    });

    it('Get: /user/:id should return user', async () => {

        let user = await User.findOne({
            where : { email: fixtures.testUser1.email }
        });

        instance.user = user;
        let result = await request({
            method  : 'GET',
            uri     : config.api.url + 'user/' + user.id,
            headers : {
                'Content-Type'  : 'application/json',
                'authorization' :  fixtures.token
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
        let invalidId = 'fake_id';
        let result = await request({
            method  : 'GET',
            uri     : config.api.url + 'user/' + invalidId,
            headers : {
                'Content-Type'  : 'application/json',
                'authorization' : 'token'
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

        let result = await request({
            method  : 'GET',
            uri     : config.api.url + 'user/' + instance.user.id,
            headers : {
                'Content-Type'  : 'application/json',
                'authorization' : fixtures.token
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
            where : { email: fixtures.testUser1.email }
        });

        if (user) {
            await user.destroy();
        }

    });
});
