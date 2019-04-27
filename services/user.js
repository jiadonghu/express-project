const User        = require('../models/user');
const Jwt         = require('jsonwebtoken');
const Permissions = require('../utils/permissions');
const Config      = require('../config');
const HttpError   = require('http-errors'); 

module.exports = {

    /**
     * Login User
     *
     * @param   {string}   email     - email address
     * @param   {string}   password  - password
     * @returns {string}             - jwt token
     */
    Login : async (email, password) => {
        
        let user = await User.findOne({
            where : { email: email, password: password }
        });
    
        if (!user) {
            throw new HttpError(404, 'User Not Found');
        }
    
        let token = Jwt.sign(
            { 
                user_id     : user.id, 
                name        : user.name, 
                permissions : [
                    Permissions.VALID_USER(user.id)
                ] 
            },
            Config.jwt.secret,
            { expiresIn: Config.jwt.expire }
        );
    
        return token;
    }
    
};