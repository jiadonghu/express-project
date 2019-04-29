const User        = require('../models/user');
const Jwt         = require('jsonwebtoken');
const Permissions = require('../utils/permissions');
const Config      = require('../config');
const HttpError   = require('http-errors'); 
const Crypto      = require('crypto');

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
            where : { email: email }
        });
    
        if (!user) {
            throw new HttpError(404, 'user not found');
        }

        let encoded_pwd = Crypto.createHash('sha256').update(password).digest('base64');

        if (user.password !== encoded_pwd) {
            throw new HttpError(401, 'incorrect password');
        }
    
        let token = Jwt.sign(
            { 
                user_id     : user.id, 
                name        : user.name, 
                permissions : [
                    Permissions.VISITOR,
                    Permissions.VALID_USER(user.id)
                ] 
            },
            Config.jwt.secret,
            { expiresIn: Config.jwt.expire }
        );
    
        return token;
    },

    /**
     * Create User
     *
     * @param   {obj}      user           - user
     * @param   {string}   user.email     - user email
     * @param   {string}   user.name      - user name
     * @param   {string}   user.password  - user password
     * @returns {string}                  - jwt token
     */
    Register : async (user) => {

        let existing_user = await User.findOne({
            where : { email: user.email }
        });

        if (existing_user) {
            throw HttpError(409, 'email already exist');
        }

        let encoded_pwd = Crypto.createHash('sha256').update(user.password).digest('base64');

        let new_user = await User.create({
            email    : user.email,
            name     : user.name,
            password : encoded_pwd
        });

        let token = Jwt.sign(
            { 
                user_id     : new_user.id, 
                name        : new_user.name, 
                permissions : [
                    Permissions.VISITOR,
                    Permissions.VALID_USER(new_user.id)
                ] 
            },
            Config.jwt.secret,
            { expiresIn: Config.jwt.expire }
        );
    
        return token;

    },
    
    /**
     * Get User
     *
     * @param   {int}      user_id     - user id
     * @returns {user}                 - user object
     */
    GetUser : async (user_id) => {

        let user = await User.findOne({
            where : { id: user_id }
        });

        if (!user) {
            throw new HttpError(404, 'user not found');
        }

        return {
            id    : user.id,
            email : user.email,
            name  : user.name
        };

    }
    
};