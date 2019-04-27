const User             = require('../models/user');
const Promise          = require('bluebird');
const Jwt              = require('jsonwebtoken');
const Config           = require('../config');
const Permissions      = require('../utils/permissions');
const ValidationResult = require('express-validator/check').validationResult;
const AuthService      = require('../services/auth');
const UserService      = require('../services/user');
const HttpError        = require('http-errors');

module.exports = {
    
    routes : [
        {
            route : '/user', method : 'get', function : 'GetUser', 
        },
        {
            route : '/login', method : 'post', function : 'Login', 
        }
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

        let errors = ValidationResult(req);

        throw new HttpError(409, 'asd')

        let user = await User.findOne({
            where : { name: 'FIRSTUSER' }
        });

        res.json('user');

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
    }


};