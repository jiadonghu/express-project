const User             = require('../models/user');
const Promise          = require('bluebird');
const Jwt              = require('jsonwebtoken');
const Config           = require('../config');
const Permissions      = require('../utils/permissions');
const ValidationResult = require('express-validator/check').validationResult;
const AuthService      = require('../services/auth');
const UserService      = require('../services/user');

module.exports = {
    
    routes : [
        {
            route : '/user/:user_id', method : 'get', function : 'GetUser', 
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
      
        AuthService.IsUser(req.user.permissions, req.params.user_id);

        let user = await UserService.GetUser(req.params.user_id);

        res.status(200).json(user);

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

        let token = await UserService.Login(req.body.email, req.body.password);

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

        let token = await UserService.Register({
            email    : req.body.email,
            password : req.body.password,
            name     : req.body.name
        });
        
        res.status(201).json({ token: token });
    }


};