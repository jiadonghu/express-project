const { check } = require('express-validator');
const { CustomValidator, CustomSanitizer} = require('./custom_validator');
let Validation = {};

Validation.User = {
    GetUser : [
        check('id').isInt().toInt()
    ],
    Login : [
        check('email').isEmail(),
        check('password').exists().isLength({ max: 128 })
    ],
    Register : [
        check('email').isEmail(),
        check('password').exists().isLength({ max: 128 }),
        check('name').exists().isLength({ max: 100 })
    ]
};

Validation.Post = {
    GetPost : [
        check('id').isInt().toInt(),
        check('user_id').isInt().toInt()
    ],
    CreatePost : [
        check('user_id').isInt().toInt(),
        check('title').isString().isLength({ max: 100 }),
        check('content').optional().isString(),
        check('tags').optional().custom(CustomValidator.int_array).customSanitizer(CustomSanitizer.to_int),
        check('image').optional().custom(CustomValidator.image_link),
        check('published').optional().isBoolean().toBoolean()
    ],
    UpdatePost : [
        check('id').isInt().toInt(),
        check('user_id').isInt().toInt(),
        check('title').isString().isLength({ max: 100 }),
        check('content').optional().isString(),
        check('tags').optional().custom(CustomValidator.int_array) .customSanitizer(CustomSanitizer.to_int),
        check('image').optional().custom(CustomValidator.image_link),
        check('published').optional().isBoolean().toBoolean()
    ],
    DeletePost : [
        check('id').isInt().toInt(),
        check('user_id').isInt().toInt()
    ],
    SearchPosts : [
        check('user_id').isInt().toInt(),
        check('tags').optional().custom(CustomValidator.int_array).customSanitizer(CustomSanitizer.to_int),
        check('published').optional().isBoolean().toBoolean()
    ]
};

Validation.Tag = {
    CreateTag : [
        check('name').exists().isLength({ max: 100 })
    ],
    SearchTags : [
        check('name').optional().isLength({ max: 100 })
    ]
};

module.exports = Validation;