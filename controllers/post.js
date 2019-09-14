const Auth             = require('../utils/auth');
const HttpError        = require('http-errors'); 
const {BlogPost, Tag}  = require('../models');

module.exports = {
    
    routes : [
        {
            route : '/user/:user_id/post/:id', method : 'get', function : 'GetPost', 
        },
        {
            route : '/user/:user_id/post', method : 'post', function : 'CreatePost', 
        },
        {
            route : '/user/:user_id/post/:id', method : 'put', function : 'UpdatePost', 
        },
        {
            route : '/user/:user_id/post/:id', method : 'delete', function : 'DeletePost', 
        },
        {
            route : '/user/:user_id/posts/search', method : 'get', function : 'SearchPosts', 
        }
    ],

    
    /**
     * Get Post
     *
     * @param   {Obj}   req     - Express request object.
     * @param   {Obj}   res     - Express response object.
     * @param   {Func}  next    - Express next()
     * @return  {Null}         
     */
    GetPost : async (req, res, next) => {

        let post = await BlogPost.findOne({
            where   : { id: req.params.id, user_id: req.params.user_id },
            include : { model: Tag, as: 'tags' } 
        });
        
        if (!post) {
            throw new HttpError(404, 'post not found');
        }
    
        if (!post.published) {
            Auth.IsUser(req.permissions, req.params.user_id);
        }

        res.status(200).json(post);

    },

    /**
     * Create Post
     *
     * @param   {Obj}   req     - Express request object.
     * @param   {Obj}   res     - Express response object.
     * @param   {Func}  next    - Express next()
     * @return  {Null}         
     */
    CreatePost : async (req, res, next) => {

        Auth.IsUser(req.permissions, req.params.user_id);
        
        let new_post = await BlogPost.create({
            user_id   : req.params.user_id,
            title     : req.body.title,
            image     : req.body.image || null,
            content   : req.body.content || null,
            published : req.body.published || false
        });
        
        if (req.body.tags) {
            await new_post.syncTags(req.body.tags);
        }
    
        res.status(201).json(new_post);
    },

    /**
     * Update Post
     *
     * @param   {Obj}   req     - Express request object.
     * @param   {Obj}   res     - Express response object.
     * @param   {Func}  next    - Express next()
     * @return  {Null}         
     */
    UpdatePost : async (req, res, next) => {

        Auth.IsUser(req.permissions, req.params.user_id);

        let op = await BlogPost.findOne({
            where : { id: req.params.id, user_id: req.params.user_id }
        });
        
        if (!op) {
            throw new HttpError(404, 'post not found');
        }

        let post = {
            title     : req.body.title,
            image     : req.body.image || null,
            content   : req.body.content || null,
            published : req.body.published || false
        };
        Object.keys(post).forEach(key => {
            op[key] = post[key];
        });

        await op.save();
        await op.syncTags(req.body.tags || []);
    
        res.status(202).json(op);
    },

    /**
     * Delete Post
     *
     * @param   {Obj}   req     - Express request object.
     * @param   {Obj}   res     - Express response object.
     * @param   {Func}  next    - Express next()
     * @return  {Null}         
     */
    DeletePost : async (req, res, next) => {

        Auth.IsUser(req.permissions, req.params.user_id);

        let post = await BlogPost.findOne({
            where : { id: req.params.id, user_id: req.params.user_id }
        });
        
        if (!post) {
            throw new HttpError(404, 'post not found');
        }
    
        await post.destroy();

        res.status(202).json({ message: 'deleted' });

    },

    /**
     * Search Posts
     *
     * @param   {Obj}   req     - Express request object.
     * @param   {Obj}   res     - Express response object.
     * @param   {Func}  next    - Express next()
     * @return  {Null}         
     */
    SearchPosts : async (req, res, next) => {

        if (req.query.published != true) {
            Auth.IsUser(req.permissions, req.params.user_id);            
        }

        let params = {
            where      : {
                user_id : req.params.user_id
            },
            attributes : ['id', 'user_id', 'title']
        };

        if (typeof req.query.published === 'boolean') {
            params.where.published = req.query.published;
        }

        if (req.query.tags) {
            params.include = {
                model      : Tag,    
                as         : 'tags',
                where      : { id: req.query.tags },
                attributes : []
            };
        }
    
        let posts = await BlogPost.findAll(params);

        res.status(200).json(posts);
    }

};