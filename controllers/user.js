const { User }         = require('../models/');
const Jwt              = require('jsonwebtoken');
const Config           = require('../config');
const Permissions      = require('../utils/permissions');
const Auth             = require('../utils/auth');
const HttpError        = require('http-errors'); 
const Crypto           = require('crypto');

module.exports = {
    
    routes : [
        {
            route : '/user/:id', method : 'get', function : 'GetUser', 
        },
        {
            route : '/login', method : 'post', function : 'Login', 
        },
        {
            route : '/register', method : 'post', function : 'Register', 
        },
    ],

    
    /**
     * GetUser
     *
     * @param   {Obj}   req     - Express request object.
     * @param   {Obj}   res     - Express response object.
     * @param   {Func}  next    - Express next()
     * @return  {Null}         
     */
    GetUser : async (req, res, next) => {

        console.log('getuser')
      
        Auth.IsUser(req.permissions, req.params.id);

        let user = await User.findOne({
            where : { id: req.params.id }
        });

        if (!user) {
            throw new HttpError(404, 'user not found');
        }

        res.status(200).json({
            id    : user.id,
            email : user.email,
            name  : user.name
        });

    },

    /**
     * Login
     *
     * @param   {Obj}   req     - Express request object.
     * @param   {Obj}   res     - Express response object.
     * @param   {Func}  next    - Express next()
     * @return  {Null}         
     */
    Login : async (req, res, next) => {

        let user = await User.findOne({
            where : { email: req.body.email }
        });
    
        if (!user) {
            throw new HttpError(404, 'user not found');
        }

        if (user.password !== Crypto.createHash('sha256').update(req.body.password).digest('base64')) {
            throw new HttpError(401, 'incorrect password');
        }
    
        let token = Jwt.sign(
            { 
                user_id     : user.id, 
                permissions : [
                    Permissions.VISITOR,
                    Permissions.VALID_USER(user.id)
                ] 
            },
            Config.jwt.secret,
            { expiresIn: Config.jwt.expire }
        );

        res.status(200).json({ token: token });
    },

    /**
     * Register
     *
     * @param   {Obj}   req     - Express request object.
     * @param   {Obj}   res     - Express response object.
     * @param   {Func}  next    - Express next()
     * @return  {Null}         
     */
    Register : async (req, res, next) => {

        let existing_user = await User.findOne({
            where : { email: req.body.email }
        });

        if (existing_user) {
            throw HttpError(409, 'email already exist');
        }

        let new_user = await User.create({
            email    : req.body.email,
            name     : req.body.name,
            password : Crypto.createHash('sha256').update(req.body.password).digest('base64')
        });

        let token = Jwt.sign(
            { 
                user_id     : new_user.id, 
                permissions : [
                    Permissions.VISITOR,
                    Permissions.VALID_USER(new_user.id)
                ] 
            },
            Config.jwt.secret,
            { expiresIn: Config.jwt.expire }
        );
        
        res.status(201).json({ token: token });
    }


};