// set env param as test 
process.env.NODE_ENV = 'test';

const {Post, Tag, PostTag, User} = require('../../models');
const {userFixture, postFixture, tagFixture} = require('../fixtures');
const should = require('should');

describe('Model Post:', () => {

    let fixtures = {
        testUser   : userFixture.random(),
        tag1       : tagFixture.random(),
        tag2       : tagFixture.random()
    };

    let instances = {};

    before(async () => {
        let user = await User.create(fixtures.testUser);
        let tag1 = await Tag.create(fixtures.tag1);
        let tag2 = await Tag.create(fixtures.tag2);
        fixtures.testPost1 = postFixture.random(user.id);
        fixtures.testPost2 = postFixture.random(user.id);
        instances.user = user;
        instances.tag1 = tag1;
        instances.tag2 = tag2;
    });

    it('Post.create should create new post', async () => {

        let testPost1 = await Post.create(fixtures.testPost1);
        let testPost2 = await Post.create(fixtures.testPost2);
        should.exist(testPost1.id);
        should.exist(testPost2.id);
        instances.testPost1 = testPost1;
        instances.testPost2 = testPost2;

    });

    it('Post.findOne should find one post', async () => {

        let testPost1 = await Post.findOne({
            where : { id: instances.testPost1.id }
        });
        let testPost2 = await Post.findOne({
            where : { id: instances.testPost2.id }
        });
        testPost1.id.should.eql(instances.testPost1.id);
        testPost1.content.should.eql(instances.testPost1.content);
        
        testPost2.id.should.eql(instances.testPost2.id);
        testPost2.content.should.eql(instances.testPost2.content);
        
    });

    it('Post.findAll should find all by user', async () => {

        let posts = await Post.findAll({
            where : { userId: instances.user.id }
        });

        posts.map(post => post.id).should.eql([
            instances.testPost1.id,
            instances.testPost2.id
        ]);

        posts.length.should.equal(2);

    });

    it('post.save should save', async () => {
        
        let anotherPost = postFixture.random(instances.user.id);
        
        instances.testPost1.content = anotherPost.content;
        await instances.testPost1.save();

        let updatedPost = await Post.findOne({
             where : { id: instances.testPost1.id }
        });
        instances.testPost1.content.should.equal(updatedPost.content);

    });

    it('post.syncTag should sync tag for post', async () => {

        await instances.testPost1.syncTags([instances.tag1.id, instances.tag2.id]);

        let postTags = await PostTag.findAll({
            where : { postId: instances.testPost1.id }
        });

        postTags.map(postTag => postTag.tagId).should.eql(
            [instances.tag1.id, instances.tag2.id]
        );

        await instances.testPost1.syncTags([instances.tag1.id]);

        postTags = await PostTag.findAll({
            where : { postId: instances.testPost1.id }
        });

        postTags.map(postTag => postTag.tagId).should.eql(
            [instances.tag1.id]
        );

    });

    it('Post.findOne and Post.findAll should include tags for posts', async () => {

        let post = await Post.findOne({
             where   : { id: instances.testPost1.id },
             include : { model: Tag, as: 'tags' } 
        });
        post.tags.map(tag => tag.id).should.eql(
            [instances.tag1.id]
        );

        let posts = await Post.findAll({
            where   : { userId: instances.user.id },
            include : { model: Tag, as: 'tags' } 
        });

        let postMap = {};
        posts.map(item => {
            postMap[item.id] = item.tags.map(tag => tag.id);
        });
        postMap[instances.testPost1.id].should.eql(
            [instances.tag1.id]
        );
        postMap[instances.testPost2.id].should.eql(
            []
        );

    });

    it('post.destroy should delete post and posttags', async () => {

        await instances.testPost1.destroy();
        await instances.testPost2.destroy();

        let posts = await Post.findAll({
            where : { userId: instances.user.id }
        });

        let postTags = await PostTag.findAll({
            where : { postId: [instances.testPost1.id, instances.testPost2.id] }
        });
        
        postTags.length.should.equal(0);
        postTags.length.should.equal(0);

    });

    after(async () => {
        await instances.user.destroy();
        await instances.tag1.destroy();
        await instances.tag2.destroy();
    })

});