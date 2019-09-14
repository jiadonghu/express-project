// set env param as test 
process.env.NODE_ENV = 'test';

const {Tag, BlogPost, PostTag} = require('../../models');
const {TagFixture, PostFixture} = require('../fixtures');
const Should = require('should');

describe('Model PostTag:', () => {

    let fixtures = {
        tag  : TagFixture.Random(),
        post : PostFixture.Random()
    };

    let instances = {};

    before(async () => {
        instances.tag = await Tag.create(fixtures.tag);
        instances.post = await BlogPost.create(fixtures.post);
    });

    it('PostTag.create should create new post tag', async () => {

        let post_tag = await PostTag.create({
            post_id : instances.post.id,
            tag_id  : instances.tag.id
        });
    
        Should.exist(post_tag.id);
        instances.post_tag = post_tag;

    });

    it('PostTag.findOne should find one post tag', async () => {

        let post_tag = await PostTag.findOne({
            where : { id: instances.post_tag.id }
        });
      
        post_tag.tag_id.should.eql(instances.post_tag.tag_id);
        post_tag.post_id.should.eql(instances.post_tag.post_id);
        
    });

    it('PostTag.findAll should find all post tags', async () => {

        let post_tags = await PostTag.findAll({
            where : { post_id: instances.post.id }
        });
        
        post_tags.map(item => item.id).indexOf(instances.post_tag.id).should.aboveOrEqual(0);

    });

    it('PostTag.destroy should delete post tag', async () => {

        await instances.post_tag.destroy();

        let post_tag = await PostTag.findOne({
            where : { id: instances.post_tag.id }
        });

        Should.not.exist(post_tag);
    });

    after(async () => {
        await instances.tag.destroy();
        await instances.post.destroy();
    });

});