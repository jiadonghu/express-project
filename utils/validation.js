const Check = require('express-validator/check').check;

let validation = {};
 
validation.User = {
    Login : [
        Check('email').isEmail(),
        Check('password').exists()
    ]
};

module.exports = validation;