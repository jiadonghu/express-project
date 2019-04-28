const Check = require('express-validator/check').check;

let validation = {};
 
validation.User = {
    GetUser : [
        Check('user_id').isInt(),
    ],
    Login : [
        Check('email').isEmail(),
        Check('password').exists().isLength({ max: 128 })
    ],
    Register : [
        Check('email').isEmail(),
        Check('password').exists().isLength({ max: 128 }),
        Check('name').exists().isLength({ max: 100 })
    ]
};

module.exports = validation;