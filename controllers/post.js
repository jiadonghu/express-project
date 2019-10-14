const auth             = require('../utils/auth');
const HttpError        = require('http-errors'); 
const {Post, Tag}  = require('../models');

module.exports = {
    
    routes : [
        {
            route : '/user/:userId/post/:id', method : 'get', function : 'getPost', 
        },
        {
            route : '/user/:userId/post', method : 'post', function : 'createPost', 
        },
        {
            route : '/user/:userId/post/:id', method : 'put', function : 'updatePost', 
        },
        {
            route : '/user/:userId/post/:id', method : 'delete', function : 'deletePost', 
        },
        {
            route : '/user/:userId/posts/search', method : 'get', function : 'searchPosts', 
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
    getPost : async (req, res, next) => {

        let post = await Post.findOne({
            where   : { id: req.params.id, userId: req.params.userId },
            include : { model: Tag, as: 'tags' } 
        });
        
        if (!post) {
            throw new HttpError(404, 'post not found');
        }
    
        if (!post.published) {
            auth.isUser(req.permissions, req.params.userId);
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
    createPost : async (req, res, next) => {

        auth.isUser(req.permissions, req.params.userId);
        
        let newPost = await Post.create({
            userId    : req.params.userId,
            title     : req.body.title,
            image     : req.body.image || null,
            content   : req.body.content || null,
            published : req.body.published || false
        });
        
        if (req.body.tags) {
            await newPost.syncTags(req.body.tags);
        }
    
        res.status(201).json(newPost);
    },

    /**
     * Update Post
     *
     * @param   {Obj}   req     - Express request object.
     * @param   {Obj}   res     - Express response object.
     * @param   {Func}  next    - Express next()
     * @return  {Null}         
     */
    updatePost : async (req, res, next) => {

        auth.isUser(req.permissions, req.params.userId);

        let op = await Post.findOne({
            where : { id: req.params.id, userId: req.params.userId }
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
    deletePost : async (req, res, next) => {

        auth.isUser(req.permissions, req.params.userId);

        let post = await Post.findOne({
            where : { id: req.params.id, userId: req.params.userId }
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
    searchPosts : async (req, res, next) => {

        let params = {
            where      : {
                userId : req.params.userId
            },
            attributes : ['id', 'userId', 'title']
        };

        // reset published to true for visitor
        try {
            auth.isUser(req.permissions, req.params.userId)
        } catch(e) {
            params.where.published = true;
        }
        
        if (req.query.tags) {
            params.include = {
                model      : Tag,    
                as         : 'tags',
                where      : { id: req.query.tags },
                attributes : []
            };
        }
    
        let posts = await Post.findAll(params);

        res.status(200).json(posts);
    }

};