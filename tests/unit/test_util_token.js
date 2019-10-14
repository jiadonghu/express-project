// set env param as test 
process.env.NODE_ENV = 'test';

const should    = require('should');
const token     = require('../../utils/token');
const jwt       = require('jsonwebtoken');
const config    = require('../../config');
const Promise   = require('bluebird');

describe('Utils Token',  () => {

    let fixtures = {
        payload : { 
            userId     : 1, 
            permissions : [
                'my.test.permissions'
            ] 
        }
    };

    before(() => {

        fixtures.vaild = jwt.sign(
            fixtures.payload,
            config.jwt.secret,
            { expiresIn: 60 * 1000 }
        );

        fixtures.invalid = jwt.sign(
            fixtures.payload,
            'xxxx',
            { expiresIn: 60 * 1000 }
        );

        fixtures.expired = jwt.sign(
            fixtures.payload,
            config.jwt.secret,
            { expiresIn: 1 }
        );

    });
    
    it('token.decode should pass when token is not attached', async () => {

        let flag = false;
        let mockReq = {
            header : () => {
                return;
            }
        };
        let mockNext = () => { flag = true; };

        token.decode(mockReq, {}, mockNext);

        flag.should.equal(true);
    });

    it('token.decode should throw error when token is invalid', async () => {

        let flag = false;
        let mockReq = {
            header : () => {
                return fixtures.invalid;
            }
        };
        let mockNext = () => { flag = true; };

        try {
            token.decode(mockReq, {}, mockNext);
            throw new Error('error here');
        } catch(e) {
            e.message.should.equal('invalid token');
        }
      
    });

    it('token.decode should throw error when token is expired', async () => {

        let flag = false;
        let mockReq = {
            header : () => {
                return fixtures.expired;
            }
        };
        let mockNext = () => { flag = true; };

        await Promise.delay(1000);
        
        try {
            token.decode(mockReq, {}, mockNext);
            throw new Error('error here');
        } catch(e) {
            e.message.should.equal('invalid token');
        }
      
    });

    it('token.decode should decode token when token is valid', async () => {

        let flag = false;
        let mockReq = {
            header : () => {
                return fixtures.vaild;
            }
        };
        let mockNext = () => { flag = true; };

        token.decode(mockReq, {}, mockNext);

        flag.should.equal(true);
        mockReq.userId.should.equal(fixtures.payload.userId);
        mockReq.permissions.should.eql(fixtures.payload.permissions)
    });
});