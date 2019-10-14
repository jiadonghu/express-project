const { User }         = require('../models/');
const jwt              = require('jsonwebtoken');
const config           = require('../config');
const permissions      = require('../utils/permissions');
const auth             = require('../utils/auth');
const HttpError        = require('http-errors'); 
const crypto           = require('crypto');

module.exports = {
    
    routes : [
        {
            route : '/user/:id', method : 'get', function : 'getUser', 
        },
        {
            route : '/login', method : 'post', function : 'login', 
        },
        {
            route : '/register', method : 'post', function : 'register', 
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
    getUser : async (req, res, next) => {
      
        auth.isUser(req.permissions, req.params.id);

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
    login : async (req, res, next) => {

        let user = await User.findOne({
            where : { email: req.body.email }
        });
    
        if (!user) {
            throw new HttpError(404, 'user not found');
        }

        if (user.password !== crypto.createHash('sha256').update(req.body.password).digest('base64')) {
            throw new HttpError(401, 'incorrect password');
        }
    
        let token = jwt.sign(
            { 
                userId      : user.id, 
                permissions : [
                    permissions.VISITOR,
                    permissions.VALID_USER(user.id)
                ] 
            },
            config.jwt.secret,
            { expiresIn: config.jwt.expire }
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
    register : async (req, res, next) => {

        let existingUser = await User.findOne({
            where : { email: req.body.email }
        });

        if (existingUser) {
            throw HttpError(409, 'email already exist');
        }

        let newUser = await User.create({
            email    : req.body.email,
            name     : req.body.name,
            password : crypto.createHash('sha256').update(req.body.password).digest('base64')
        });

        let token = jwt.sign(
            { 
                userId     : newUser.id, 
                permissions : [
                    permissions.VISITOR,
                    permissions.VALID_USER(newUser.id)
                ] 
            },
            config.jwt.secret,
            { expiresIn: config.jwt.expire }
        );
        
        res.status(201).json({ token: token });
    }


};