const Auth         = require('../utils/auth');
const HttpError    = require('http-errors'); 
const {Tag}        = require('../models');

module.exports = {
    
    routes : [
        {
            route : '/tag', method : 'post', function : 'CreateTag', 
        },
        {
            route : '/tags/search', method : 'get', function : 'SearchTags', 
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
    CreateTag : async (req, res, next) => {

        Auth.IsUser(req.permissions, req.user_id);
        
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
    SearchTags : async (req, res, next) => {

        let tags = await Tag.SearchByName(req.query.name)
    
        res.status(200).json(tags);
    }

};