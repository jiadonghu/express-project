// set env param as test 
process.env.NODE_ENV = 'test';

const auth         = require('../../utils/auth');
const should       = require('should');
const permissions  = require('../../utils/permissions');
const Chance       = require('chance');

describe('Service auth:', () => {

    let chance = new Chance();
    let fixtures = {
        testUserId : chance.integer()
    };
    
    before(() => {
        fixtures.userPermissions = [
            permissions.VISITOR,
            permissions.VALID_USER(fixtures.testUserId)
        ];
        fixtures.visitorPermissions = [
            permissions.VISITOR
        ];
    });

    it('auth.isUser should return true if user is validated', async () => {

        let result = auth.isUser(fixtures.userPermissions, fixtures.testUserId);
        result.should.equal(true);

    });

    it('auth.isUser should throw error 401 when permissions are invalid (user id mismatch)', async () => {
        
        try {
            
            let result = auth.isUser(fixtures.userPermissions, fixtures.testUserId + 1);
            throw new Error('should not reach this line');
        
        } catch(e) {
            e.statusCode.should.equal(401);
        }

    });

    it('auth.isUser should throw error 401 when permissions are invalid (lack of permission)', async () => {
        
        try {
            
            let result = auth.isUser(fixtures.visitorPermissions, fixtures.testUserId);
            throw new Error('should not reach this line');
        
        } catch(e) {
            e.statusCode.should.equal(401);
        }

    });

    it('auth.isUser should throw error 401 when permissions is not an array', async () => {
        
        try {

            let result = auth.isUser('admin permission', fixtures.testUserId);
            throw new Error('should not reach this line');
    
        } catch(e) {
            e.statusCode.should.equal(401);
        }


    });

    it('auth.isVisitor should return true if user is validated', async () => {

        let resultVisitor = auth.isVisitor(fixtures.visitorPermissions);
        let resultUser = auth.isVisitor(fixtures.visitorPermissions);
        resultVisitor.should.equal(true);
        resultUser.should.equal(true);

    });

    it('auth.isVisitor should throw error 401 when permissions are invalid', async () => {
        
        try {

            let result = auth.isVisitor([]);
            throw new Error('should not reach this line');
        
        } catch(e) {
            e.statusCode.should.equal(401);
        }

    });

    it('auth.isVisitor should throw error 401 when permissions is not an array', async () => {
        
        try {
            
            let result = auth.isVisitor('visitor');
            throw new Error('should not reach this line');
        
        } catch(e) {
            e.statusCode.should.equal(401);
        }

    });
});

