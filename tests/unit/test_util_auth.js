// set env param as test 
process.env.NODE_ENV = 'test';

const Auth        = require('../../utils/auth');
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

    it('Auth.IsUser should return true if user is validated', async () => {

        let result = Auth.IsUser(fixtures.user_permissions, fixtures.test_user_id);
        result.should.equal(true);

    });

    it('Auth.IsUser should throw error 401 when permissions are invalid (user id mismatch)', async () => {
        
        try {
            
            let result = Auth.IsUser(fixtures.user_permissions, fixtures.test_user_id + 1);
            throw new Error('should not reach this line');
        
        } catch(e) {
            e.statusCode.should.equal(401);
        }

    });

    it('Auth.IsUser should throw error 401 when permissions are invalid (lack of permission)', async () => {
        
        try {
            
            let result = Auth.IsUser(fixtures.visitor_permissions, fixtures.test_user_id);
            throw new Error('should not reach this line');
        
        } catch(e) {
            e.statusCode.should.equal(401);
        }

    });

    it('Auth.IsUser should throw error 401 when permissions is not an array', async () => {
        
        try {

            let result = Auth.IsUser('admin permission', fixtures.test_user_id);
            throw new Error('should not reach this line');
    
        } catch(e) {
            e.statusCode.should.equal(401);
        }


    });

    it('Auth.IsVisitor should return true if user is validated', async () => {

        let result_visitor = Auth.IsVisitor(fixtures.visitor_permissions);
        let result_user = Auth.IsVisitor(fixtures.visitor_permissions);
        result_visitor.should.equal(true);
        result_user.should.equal(true);

    });

    it('Auth.IsVisitor should throw error 401 when permissions are invalid', async () => {
        
        try {

            let result = Auth.IsVisitor([]);
            throw new Error('should not reach this line');
        
        } catch(e) {
            e.statusCode.should.equal(401);
        }

    });

    it('Auth.IsVisitor should throw error 401 when permissions is not an array', async () => {
        
        try {
            
            let result = Auth.IsVisitor('visitor');
            throw new Error('should not reach this line');
        
        } catch(e) {
            e.statusCode.should.equal(401);
        }

    });
});

