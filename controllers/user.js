const User             = require('../models/user');
const Promise          = require('bluebird');
const Jwt              = require('jsonwebtoken');
const Config           = require('../config');
const Permissions      = require('../utils/permissions');
const ValidationResult = require('express-validator/check').validationResult;

module.exports = {
    
    routes : [
        {
            route : '/user', method : 'get', function : 'GetUser'
        },
        {
            route : '/login', method : 'post', function : 'Login'
        },
    ],

    GetUser : async (req, res) => {

        let user = await User.findOne({
            where : { name: 'FIRSTUSER' }
        });

        return res.send('user');

    },

    Login : async (req, res) => {

        let errors = ValidationResult(req);
        
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        let user = await User.findOne({
            where : { email: req.body.email, password: req.body.password }
        });

        if (!user) {
            return res.status(404).json({ message: 'User Not Found'});
        }

        // create a token
        let token = Jwt.sign(
            { 
                user_id     : user.id, 
                name        : user.name, 
                permissions : [
                    Permissions.VALID_USER(user.id)
                 ] 
            },
            Config.jwt.secret,
            { expiresIn: 86400 }
        );

        return res.status(200).json({ auth: true, token: token });
    },




};