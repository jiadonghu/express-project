// set env param as test 
process.env.NODE_ENV = 'test';

const AuthService = require('../../services/auth');
const Should      = require('should');
const Permissions = require('../../utils/permissions');
const UserFixture = require('../fixtures/user');
const Chance      = require('chance');

describe('Service Auth:', () => {

    let chance = new Chance();
    let fixtures = {
        test_user_id : chance.integer()
    };
    
    before(() => {
        fixtures.user_permissions = [
            Permissions.VISITOR,
            Permissions.VALID_USER(fixtures.test_user_id)
        ];
        fixtures.visitor_permissions = [
            Permissions.VISITOR
        ];
    });

    it('AuthService.IsUser should return true if user is validated', async () => {

        let result = AuthService.IsUser(fixtures.user_permissions, fixtures.test_user_id);
        result.should.equal(true);

    });

    it('AuthService.IsUser should throw error 401 when permissions are invalid (user id mismatch)', async () => {
        
        try {
            
            let result = AuthService.IsUser(fixtures.user_permissions, fixtures.test_user_id + 1);
            throw new Error('should not reach this line');
        
        } catch(e) {
            e.statusCode.should.equal(401);
        }

    });

    it('AuthService.IsUser should throw error 401 when permissions are invalid (lack of permission)', async () => {
        
        try {
            
            let result = AuthService.IsUser(fixtures.visitor_permissions, fixtures.test_user_id);
            throw new Error('should not reach this line');
        
        } catch(e) {
            e.statusCode.should.equal(401);
        }

    });

    it('AuthService.IsUser should throw error 401 when permissions is not an array', async () => {
        
        try {

            let result = AuthService.IsUser('admin permission', fixtures.test_user_id);
            throw new Error('should not reach this line');
    
        } catch(e) {
            e.statusCode.should.equal(401);
        }


    });

    it('AuthService.IsVisitor should return true if user is validated', async () => {

        let result_visitor = AuthService.IsVisitor(fixtures.visitor_permissions);
        let result_user = AuthService.IsVisitor(fixtures.visitor_permissions);
        result_visitor.should.equal(true);
        result_user.should.equal(true);

    });

    it('AuthService.IsVisitor should throw error 401 when permissions are invalid', async () => {
        
        try {

            let result = AuthService.IsVisitor([]);
            throw new Error('should not reach this line');
        
        } catch(e) {
            e.statusCode.should.equal(401);
        }

    });

    it('AuthService.IsVisitor should throw error 401 when permissions is not an array', async () => {
        
        try {
            
            let result = AuthService.IsVisitor('visitor');
            throw new Error('should not reach this line');
        
        } catch(e) {
            e.statusCode.should.equal(401);
        }

    });
});

