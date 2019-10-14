const { check } = require('express-validator');
const { customValidator, customSanitizer} = require('./custom_validator');
let validation = {};

validation.user = {
    getUser : [
        check('id').isInt().toInt()
    ],
    login : [
        check('email').isEmail(),
        check('password').exists().isLength({ max: 128 })
    ],
    register : [
        check('email').isEmail(),
        check('password').exists().isLength({ max: 128 }),
        check('name').exists().isLength({ max: 100 })
    ]
};

validation.post = {
    getPost : [
        check('id').isInt().toInt(),
        check('userId').isInt().toInt()
    ],
    createPost : [
        check('userId').isInt().toInt(),
        check('title').isString().isLength({ max: 100 }),
        check('content').optional().isString(),
        check('tags').optional().custom(customValidator.intArray).customSanitizer(customSanitizer.toInt),
        check('image').optional().custom(customValidator.imageLink),
        check('published').optional().isBoolean().toBoolean()
    ],
    updatePost : [
        check('id').isInt().toInt(),
        check('userId').isInt().toInt(),
        check('title').isString().isLength({ max: 100 }),
        check('content').optional().isString(),
        check('tags').optional().custom(customValidator.intArray).customSanitizer(customSanitizer.toInt),
        check('image').optional().custom(customValidator.imageLink),
        check('published').optional().isBoolean().toBoolean()
    ],
    deletePost : [
        check('id').isInt().toInt(),
        check('userId').isInt().toInt()
    ],
    searchPosts : [
        check('userId').isInt().toInt(),
        check('tags').optional().custom(customValidator.intArray).customSanitizer(customSanitizer.toInt),
        check('published').optional().isBoolean().toBoolean()
    ]
};

validation.tag = {
    createTag : [
        check('name').exists().isLength({ max: 100 })
    ],
    searchTags : [
        check('name').optional().isLength({ max: 100 })
    ]
};

module.exports = validation;