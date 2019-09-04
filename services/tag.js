const User        = require('../models/user');
const BlogPost    = require('../models/blog_post');
const Tag         = require('../models/tag');
const PostTag     = require('../models/blog_post');
const Config      = require('../config');
const HttpError   = require('http-errors'); 

const GetPost = async (post_id) => {
    let post = await BlogPost.find({ id: post_id });
    
    if (!post) {
        throw new HttpError(404, 'post not found');
    }

    return post;
};

const GetTagByName = async (name) => {
    let tag = await Tag.find({ name: name });
    
}

const CreateTag = async (tag) => {
    let tag = await Tag.find({ name: name });
    if (tag) {
        throw new HttpError(409, 'tag already exists'); 
    }
    return await Tag.create(tag);
};

const UpdateTag = async (tag) => {
    let original_tag = await Tag.find({ id: tag.id });
    let tag_by_name = await Tag.find({ name: name });
    if (!original_tag) {
        throw new HttpError(404, 'tag not found');
    }
    if (tag_by_name.name == tag.name) {
        throw new HttpError(409, 'tag already exists'); 
    }

    Object.keys(tag, key => {
        original_tag[key] = tag[key];
    });
    
    await original_tag.save();

    return original_tag;
};

const DeleteTag = async (id) => {
    let tag = await Tag.findOne({ id: id });
    
}


module.exports = {
   
};