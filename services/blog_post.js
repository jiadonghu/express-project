const {BlogPost, Tag, PostTag, User} = require('../models');
const Config      = require('../config');
const HttpError   = require('http-errors'); 

const CreatePost = async (post) => {

    let new_post = await BlogPost.create(post);
    await new_post.syncTags();

    return new_post;
};
    
const UpdatePost = async (post) => {

    let op = await BlogPost.findOne({ id: post.id });

    if (!op) {
        throw new HttpError(404, 'post not found');
    }

    Object.keys(post, key => {
        op[key] = post[key];
    });
    
    await op.save();
    await op.syncTags();

    return op;
};

const GetPost = async (post_id, user_id) => {
    let post = await BlogPost.findOne({ id: post_id });
    
    if (!post) {
        throw new HttpError(404, 'post not found');
    }

    if(!post.published)

    return post;
};

const SearchPosts = async (options = {}) => {

    let params = {
        where : {}
    };

    // mapping search params
    for (let key of Object.keys(options)) {
        switch(key) {
            case 'user_id':
            case 'published':
            params.where[key] = options[key];
            break;
            case 'tags':
            params.include = {
                model      : Tag,    
                where      : { name: options[key] },
                attributes : []
            };
            break;
            default:
            break;
        }
    }

    return await BlogPost.findAll(params);
};

const DeletePost = async (post_id) => {
    let post = await BlogPost.findOne({ id: post_id });
    
    if (!post) {
        throw new HttpError(404, 'post not found');
    }

    return post.destroy();
};

module.exports = {
    CreatePost,
    UpdatePost,
    GetPost,
    SearchPosts,
    DeletePost
};