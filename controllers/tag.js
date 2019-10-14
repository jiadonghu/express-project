const auth         = require('../utils/auth');
const HttpError    = require('http-errors'); 
const {Tag}        = require('../models');

module.exports = {
    
    routes : [
        {
            route : '/tag', method : 'post', function : 'createTag', 
        },
        {
            route : '/tags/search', method : 'get', function : 'searchTags', 
        }
    ],

    /**
     * Create Tag
     *
     * @param   {Obj}   req     - Express request object.
     * @param   {Obj}   res     - Express response object.
     * @param   {Func}  next    - Express next()
     * @return  {Null}         
     */
    createTag : async (req, res, next) => {

        auth.isUser(req.permissions, req.userId);
        
        let tag = await Tag.create({
            name : req.body.name
        });
    
        res.status(201).json(tag);
    },

    /**
     * Search Tags
     *
     * @param   {Obj}   req     - Express request object.
     * @param   {Obj}   res     - Express response object.
     * @param   {Func}  next    - Express next()
     * @return  {Null}         
     */
    searchTags : async (req, res, next) => {

        let tags = await Tag.searchByName(req.query.name)
    
        res.status(200).json(tags);
    }

};