// set env param as test 
process.env.NODE_ENV = 'test';

const {BlogPost, Tag, PostTag, User} = require('../../models');
const {UserFixture, PostFixture, TagFixture} = require('../fixtures');
const Should = require('should');

describe('Model Blog Post:', () => {

    let fixtures = {
        test_user   : UserFixture.Random(),
        tag_1       : TagFixture.Random(),
        tag_2       : TagFixture.Random()
    };

    let instances = {};

    before(async () => {
        let user = await User.create(fixtures.test_user);
        let tag_1 = await Tag.create(fixtures.tag_1);
        let tag_2 = await Tag.create(fixtures.tag_2);
        fixtures.test_post_1 = PostFixture.Random(user.id);
        fixtures.test_post_2 = PostFixture.Random(user.id);
        instances.user = user;
        instances.tag_1 = tag_1;
        instances.tag_2 = tag_2;
    });

    it('BlogPost.create should create new blog post', async () => {

        let test_post_1 = await BlogPost.create(fixtures.test_post_1);
        let test_post_2 = await BlogPost.create(fixtures.test_post_2);
        Should.exist(test_post_1.id);
        Should.exist(test_post_2.id);
        instances.test_post_1 = test_post_1;
        instances.test_post_2 = test_post_2;

    });

    it('BlogPost.findOne should find one post', async () => {

        let test_post_1 = await BlogPost.findOne({
            where : { id: instances.test_post_1.id }
        });
        let test_post_2 = await BlogPost.findOne({
            where : { id: instances.test_post_2.id }
        });
        test_post_1.id.should.eql(instances.test_post_1.id);
        test_post_1.content.should.eql(instances.test_post_1.content);
        
        test_post_2.id.should.eql(instances.test_post_2.id);
        test_post_2.content.should.eql(instances.test_post_2.content);
        
    });

    it('BlogPost.findAll should find all by user', async () => {

        let posts = await BlogPost.findAll({
            where : { user_id: instances.user.id }
        });

        posts.map(post => post.id).should.eql([
            instances.test_post_1.id,
            instances.test_post_2.id
        ]);

        posts.length.should.equal(2);

    });

    it('blogpost.save should save', async () => {
        
        let another_post = PostFixture.Random(instances.user.id);
        
        instances.test_post_1.content = another_post.content;
        await instances.test_post_1.save();

        let updated_post = await BlogPost.findOne({
             where : { id: instances.test_post_1.id }
        });
        instances.test_post_1.content.should.equal(updated_post.content);

    });

    it('blogpost.syncTag should sync tag for blog post', async () => {

        await instances.test_post_1.syncTags([instances.tag_1, instances.tag_2]);

        let post_tags = await PostTag.findAll({
            where : { post_id: instances.test_post_1.id }
        });

        post_tags.map(post_tag => post_tag.tag_id).should.eql(
            [instances.tag_1.id, instances.tag_2.id]
        );

        await instances.test_post_1.syncTags([instances.tag_1]);

        post_tags = await PostTag.findAll({
            where : { post_id: instances.test_post_1.id }
        });

        post_tags.map(post_tag => post_tag.tag_id).should.eql(
            [instances.tag_1.id]
        );

    });

    it('BlogPost.findOne and BlogPost.findAll should include tags for blog posts', async () => {

        let post = await BlogPost.findOne({
             where   : { id: instances.test_post_1.id },
             include : { model: Tag, as: 'tags' } 
        });
        post.tags.map(tag => tag.id).should.eql(
            [instances.tag_1.id]
        );

        let posts = await BlogPost.findAll({
            where : { user_id: instances.user.id },
            include : { model: Tag, as: 'tags' } 
        });

        let post_map = {};
        posts.map(item => {
            post_map[item.id] = item.tags.map(tag => tag.id);
        });
        post_map[instances.test_post_1.id].should.eql(
            [instances.tag_1.id]
        );
        post_map[instances.test_post_2.id].should.eql(
            []
        );

    });

    it('blogpost.destroy should delete blogpost and posttags', async () => {

        await instances.test_post_1.destroy();
        await instances.test_post_2.destroy();

        let posts = await BlogPost.findAll({
            where : { user_id: instances.user.id }
        });

        let post_tags = await PostTag.findAll({
            where : { post_id: [instances.test_post_1.id, instances.test_post_2.id] }
        });
        
        post_tags.length.should.equal(0);
        post_tags.length.should.equal(0);

    });

    after(async () => {
        await instances.user.destroy();
        await instances.tag_1.destroy();
        await instances.tag_2.destroy();
    })

});