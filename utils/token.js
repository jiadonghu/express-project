const HttpError = require('http-errors');
const jwt       = require('jsonwebtoken');
const config    = require('../config');

module.exports = {
    
    /**
     * Middleware function to decode and validate a token
     *
     * @param   {Obj}   req     - Express request object.
     * @param   {Obj}   res     - Express response object.
     * @param   {Func}  next    - Express next()
     * @return  {Null}                      
     */
    decode : (req, res, next) => {

        let token = req.header('authorization');

        if (!token) {
            return next();
        }

        let decoded;
        
        try {
            decoded = jwt.verify(token, config.jwt.secret);
        } catch (e) {
            throw new HttpError(401, 'invalid token');
        }

        req.permissions = decoded.permissions;
        if (decoded.userId) {
            req.userId = decoded.userId;
        }
        
        next();
        
    }
}