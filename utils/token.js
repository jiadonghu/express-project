const HttpError = require('http-errors');
const Jwt       = require('jsonwebtoken');
const Config    = require('../config');

module.exports = {
    
    /**
     * Middleware function to decode and validate a token
     *
     * @param   {Obj}   req     - Express request object.
     * @param   {Obj}   res     - Express response object.
     * @param   {Func}  next    - Express next()
     * @return  {Null}                      
     */
    Decode : (req, res, next) => {

        let token = req.header('authorization');

        if (!token) {
            return next();
        }

        let decoded;
        
        try {
            decoded = Jwt.verify(token, Config.jwt.secret);
        } catch (e) {
            throw new HttpError(401, 'invalid token');
        }

        req.permissions = decoded.permissions;
        if (decoded.user_id) {
            req.user_id = decoded.user_id;
        }
        
        next();
        
    }
}