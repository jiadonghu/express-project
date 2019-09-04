const Check = require('express-validator/check').check;

let Validation = {};
 
Validation.User = {
    GetUser : [
        Check('user_id').isInt()
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

Validation.Post = {
    GetPost : [
        Check('id').isInt(),
    ],
    CreatPost : [
        Check('title').exists().isLength({ max: 100 }),
        Check('content').optional(),
        Check('tags').optional()
    ],
}

module.exports = Validation;