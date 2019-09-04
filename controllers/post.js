const Promise          = require('bluebird');
const Jwt              = require('jsonwebtoken');
const Config           = require('../config');
const Permissions      = require('../utils/permissions');
const ValidationResult = require('express-validator/check').validationResult;
const PostService      = require('../services/blog_post');
const HttpError        = require('http-errors'); 
const {BlogPost, Tag, PostTag, User} = require('../models');

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
            route : '/user/:user_id/post', method : 'delete', function : 'DeletePost', 
        // },
        // {
        //     route : 'user/:user_id/posts/search', method : 'get', function : 'SearchPosts', 
        }
    ],

    
    /**
     * GetPost
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
    
        if (!post.published && !post.user_id != req.user_id) {
            throw new HttpError(401, 'this post is not published');
        }

        res.status(200).json(post);

    },

    CreatePost : async (req, res, next) => {

        AuthService.IsUser(req.permissions, req.params.user_id);
        
        let new_post = await BlogPost.create({
            user_id   : req.params.user_id,
            title     : req.params.title,
            image     : req.params.image || null,
            content   : req.params.content || null,
            published : req.params.published || false
        });
        
        if (req.params.tags) {
            await new_post.syncTags(req.params.tags);
        }
    
        res.status(201).json(new_post);
    },

    UpdatePost : async (req, res, next) => {

        AuthService.IsUser(req.permissions, req.params.user_id);

        let op = await BlogPost.findOne({ id: req.params.id, user_id: req.params.user_id });
        
        if (!op) {
            throw new HttpError(404, 'post not found');
        }

        let post = {
            title     : req.params.title,
            image     : req.params.image || null,
            content   : req.params.content || null,
            published : req.params.published || false
        };
    
        Object.keys(post, key => {
            op[key] = post[key];
        });
        
        await op.save();
        await op.syncTags(req.params.tags || []);
    
        res.status(202).json(op);
    },

    DeletePost : async (req, res, next) => {

        AuthService.IsUser(req.permissions, req.params.user_id);

        let post = await BlogPost.findOne({
            where : { id: req.params.id, user_id: req.params.user_id }
        });
        
        if (!post) {
            throw new HttpError(404, 'post not found');
        }
    
        await post.destroy();

        res.status(204);

    }

};