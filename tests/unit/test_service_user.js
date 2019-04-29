// set env param as test 
process.env.NODE_ENV = 'test';

const UserFixture = require('../fixtures/user');
const Should      = require('should');
const User        = require('../../models/user');
const UserService = require('../../services/user');
const Jwt         = require('jsonwebtoken');
const Permissions = require('../../utils/permissions');
const Crypto      = require('crypto');
const Config      = require('../../config');

describe('Sevice User:', () => {

    let fixtures = {
        test_user : UserFixture.RandomUser()
    };
    
    let instance = {};

    it('UserService.Register should create new user and return token', async () => {

        let token = await UserService.Register(fixtures.test_user);
        
         Should.exist(token);
     
         let user = await User.findOne({
             where : { email: fixtures.test_user.email }
         });
        
         Should.exist(user);
         instance.user = user;

         let decoded = Jwt.verify(token, Config.jwt.secret);

         decoded.user_id.should.equal(user.id);
         decoded.name.should.equal(user.name);
         decoded.permissions.sort().should.eql(
             [Permissions.VISITOR, Permissions.VALID_USER(user.id)].sort()
         );
     });

    it('UserService.Register should throw error 409 when user email is already exist', async () => {

        try {
            let token = await UserService.Register(fixtures.test_user);
            throw new Error('should not reach this line');
        } catch(e) {
            e.statusCode.should.equal(409);
        }

    });

    it('UserService.Login return token', async () => {
        
        let token = await UserService.Login(fixtures.test_user.email, fixtures.test_user.password);
        Should.exist(token);
        let decoded = Jwt.verify(token, Config.jwt.secret);
        decoded.user_id.should.equal(instance.user.id);
        decoded.name.should.equal(instance.user.name);
        decoded.permissions.sort().should.eql(
            [Permissions.VISITOR, Permissions.VALID_USER(instance.user.id)].sort()
        );
        
    });

    it('UserService.Login return error 401 when password is incorrect', async () => {
        
        try {
            
            let token = await UserService.Login(fixtures.test_user.email, fixtures.test_user.password + 'incorrect');
            throw new Error('should not reach this line');

        } catch(e) {
            e.statusCode.should.equal(401);
        }
        
    });

    it('UserService.GetUser should get user by id', async () => {
        
        let user = await UserService.GetUser(instance.user.id);
        user.id.should.eql(instance.user.id);
        user.email.should.eql(instance.user.email);
        user.name.should.eql(instance.user.name);
        Should.not.exist(user.password);
        
    });

    it('UserService.GetUser should throw 404 error when user is not found', async () => {
        
        try {

            // delete created user from db
            await instance.user.destroy();
            let user = await UserService.GetUser(instance.user.id);
            throw new Error('should not reach this line');

        } catch(e) {
            e.statusCode.should.equal(404);
        }
        
    });

    it('UserService.Login should throw 404 error when user is not found', async () => {
        
        try {

            let token = await UserService.Login(fixtures.test_user.email, fixtures.test_user.password);
            throw new Error('should not reach this line');
    
        } catch(e) {
            e.statusCode.should.equal(404);
        }
        
    });

});