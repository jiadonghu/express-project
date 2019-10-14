// set env param as test 
process.env.NODE_ENV = 'test';

const {Tag, Post, PostTag} = require('../../models');
const {tagFixture, postFixture} = require('../fixtures');
const should = require('should');

describe('Model PostTag:', () => {

    let fixtures = {
        tag  : tagFixture.random(),
        post : postFixture.random()
    };

    let instances = {};

    before(async () => {
        instances.tag = await Tag.create(fixtures.tag);
        instances.post = await Post.create(fixtures.post);
    });

    it('PostTag.create should create new post tag', async () => {

        let postTag = await PostTag.create({
            postId : instances.post.id,
            tagId  : instances.tag.id
        });
    
        should.exist(postTag.id);
        instances.postTag = postTag;

    });

    it('PostTag.findOne should find one post tag', async () => {

        let postTag = await PostTag.findOne({
            where : { id: instances.postTag.id }
        });
      
        postTag.tagId.should.eql(instances.postTag.tagId);
        postTag.postId.should.eql(instances.postTag.postId);
        
    });

    it('PostTag.findAll should find all post tags', async () => {

        let postTags = await PostTag.findAll({
            where : { postId: instances.post.id }
        });
        
        postTags.map(item => item.id).indexOf(instances.postTag.id).should.aboveOrEqual(0);

    });

    it('PostTag.destroy should delete post tag', async () => {

        await instances.postTag.destroy();

        let postTag = await PostTag.findOne({
            where : { id: instances.postTag.id }
        });

        should.not.exist(postTag);
    });

    after(async () => {
        await instances.tag.destroy();
        await instances.post.destroy();
    });

});