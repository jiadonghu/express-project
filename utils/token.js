const HttpError = require('http-errors');
const Jwt       = require('jsonwebtoken');
const Config    = require('../config');

const exceptions = [
    '/login',
    '/register'
];

module.exports = {
    Decode : (req, res, next) => {

        let token = req.header('authorization');

        if (!token) {
            return next();
        }

        let decoded;
        
        try {
            decoded = Jwt.verify(token, Config.jwt.secret);
        } catch (e) {
            throw new HttpError(400, 'invalid token');
        }

        req.permissions = decoded.permissions;
        
        if (decoded.user_id) {
            req.user_id = decoded.user_id;
        }
        
        next();
        
    }
}