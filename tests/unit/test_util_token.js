// set env param as test 
process.env.NODE_ENV = 'test';

const Should    = require('should');
const Token     = require('../../utils/token');
const Jwt       = require('jsonwebtoken');
const Config    = require('../../config');
const Promise   = require('bluebird');

describe('Utils Token',  () => {

    let fixtures = {
        payload : { 
            user_id     : 1, 
            permissions : [
                'my.test.permissions'
            ] 
        }
    };

    before(() => {

        fixtures.vaild = Jwt.sign(
            fixtures.payload,
            Config.jwt.secret,
            { expiresIn: 60 * 1000 }
        );

        fixtures.invalid = Jwt.sign(
            fixtures.payload,
            'xxxx',
            { expiresIn: 60 * 1000 }
        );

        fixtures.expired = Jwt.sign(
            fixtures.payload,
            Config.jwt.secret,
            { expiresIn: 1 }
        );

    });
    
    it('Token.Decode should pass when token is not attached', async () => {

        let flag = false;
        let mock_req = {
            header : () => {
                return;
            }
        };
        let mock_next = () => { flag = true; };

        Token.Decode(mock_req, {}, mock_next);

        flag.should.equal(true);
    });

    it('Token.Decode should throw error when token is invalid', async () => {

        let flag = false;
        let mock_req = {
            header : () => {
                return fixtures.invalid;
            }
        };
        let mock_next = () => { flag = true; };

        try {
            Token.Decode(mock_req, {}, mock_next);
            throw new Error('error here');
        } catch(e) {
            e.message.should.equal('invalid token');
        }
      
    });

    it('Token.Decode should throw error when token is expired', async () => {

        let flag = false;
        let mock_req = {
            header : () => {
                return fixtures.expired;
            }
        };
        let mock_next = () => { flag = true; };

        await Promise.delay(1000);
        
        try {
            Token.Decode(mock_req, {}, mock_next);
            throw new Error('error here');
        } catch(e) {
            e.message.should.equal('invalid token');
        }
      
    });

    it('Token.Decode should decode token when token is valid', async () => {

        let flag = false;
        let mock_req = {
            header : () => {
                return fixtures.vaild;
            }
        };
        let mock_next = () => { flag = true; };

        Token.Decode(mock_req, {}, mock_next);

        flag.should.equal(true);
        mock_req.user_id.should.equal(fixtures.payload.user_id);
        mock_req.permissions.should.eql(fixtures.payload.permissions)
    });
});