// set env param as test 
process.env.NODE_ENV = 'test';

const {Post, Tag, PostTag, User}             = require('../../models');
const {userFixture, postFixture, tagFixture} = require('../fixtures');
const should                                 = require('should');
const request                                = require('request-promise');
const promise                                = require('bluebird');
const jwt                                    = require('jsonwebtoken');
const permissions                            = require('../../utils/permissions');
const config                                 = require('../../config');


describe('Controller Post', () => {

    let fixtures = {
        user  : userFixture.random(),
        tag1  : tagFixture.random(),
        tag2  : tagFixture.random(),
        post1 : postFixture.random(),
        post2 : postFixture.random()
    };
    let instances = {};

    before(async () => {
        // start service
        let app = require('../../app');

        instances.user = await User.create(fixtures.user);
        instances.tag1 = await Tag.create(fixtures.tag1);
        instances.tag2 = await Tag.create(fixtures.tag2);

        fixtures.userToken = jwt.sign(
            { 
                userId     : instances.user.id, 
                permissions : [
                    permissions.VISITOR,
                    permissions.VALID_USER(instances.user.id)
                ] 
            },
            config.jwt.secret,
            { expiresIn: 60 }
        );
        fixtures.visitorToken = jwt.sign(
            { 
                permissions : [
                    permissions.VISITOR
                ] 
            },
            config.jwt.secret,
            { expiresIn: 60 }
        );
        await promise.delay(1000);
    });

    // CREATE
    it('POST: user/:userId/post should return 400 when params are invalid', async () => {

            let result = await request({
                method                  : 'POST',
                uri                     : config.api.url + `user/${instances.user.id}/post`,
                headers                 : { 'authorization': fixtures.userToken },
                body                    : {},
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(400);

    });

    it('POST: user/:userId/post should return 401 when user permission is incorrect', async () => {

            let result = await request({
                method                  : 'POST',
                uri                     : config.api.url + `user/${instances.user.id + 1}/post`,
                headers                 : { 'authorization': fixtures.userToken },
                body                    : {
                    title : fixtures.post1.title 
                },
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(401);

    });

    it('POST: user/:userId/post should create post with minimum params', async () => {

            let result = await request({
                method                  : 'POST',
                uri                     : config.api.url + `user/${instances.user.id}/post`,
                headers                 : { 'authorization': fixtures.userToken },
                body                    : {
                    title : fixtures.post1.title 
                },
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(201);

            let post = await Post.findOne({ 
                where   : { id: result.body.id },
                include : { model: Tag, as: 'tags' } 
            });

            instances.post1 = post;
            post.title.should.equal(fixtures.post1.title);
            post.userId.should.equal(instances.user.id);
            post.published.should.equal(false);
            post.tags.length.should.equal(0);
            should.not.exist(post.image);
            should.not.exist(post.content);

    });

    it('POST: user/:userId/post should create post with all params', async () => {

            let result = await request({
                method                  : 'POST',
                uri                     : config.api.url + `user/${instances.user.id}/post`,
                headers                 : { 'authorization': fixtures.userToken },
                body                    : {
                    title      : fixtures.post2.title,
                    image      : fixtures.post2.image,
                    content    : fixtures.post2.content,
                    published  : fixtures.post2.published,
                    tags       : [instances.tag1.id, instances.tag2.id]
                },
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(201);
            
            let post = await Post.findOne({ 
                where   : { id: result.body.id },
                include : { model: Tag, as: 'tags' } 
            });

            instances.post2 = post;
            post.title.should.equal(fixtures.post2.title);
            post.userId.should.equal(instances.user.id);
            post.published.should.equal(fixtures.post2.published);
            post.image.should.equal(fixtures.post2.image);
            post.content.should.equal(fixtures.post2.content);
            post.tags.map(tag => tag.id).should.eql([instances.tag1.id, instances.tag2.id]);
        
    });

    // UPDATE 
    it('PUT: user/:userId/post should return 400 when params are invalid', async () => {

            let result = await request({
                method                  : 'PUT',
                uri                     : config.api.url + `user/${instances.user.id}/post/${instances.post1.id}`,
                headers                 : { 'authorization': fixtures.userToken },
                body                    : {
                    title : { title: 'test' }
                },
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(400);

    });

    it('PUT: user/:userId/post should return 401 user permission is incorrect', async () => {

            let result = await request({
                method                  : 'PUT',
                uri                     : config.api.url + `user/${instances.user.id + 1}/post/${instances.post1.id}`,
                headers                 : { 'authorization': fixtures.userToken },
                body                    : {
                    title : fixtures.post1.title
                },
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(401);

    });

    it('PUT: user/:userId/post should update post with minimum params', async () => {

        fixtures.post2.title = postFixture.random().title;
        let result = await request({
            method                  : 'PUT',
            uri                     : config.api.url + `user/${instances.user.id}/post/${instances.post2.id}`,
            headers                 : { 'authorization': fixtures.userToken },
            body                    : {
                title : fixtures.post2.title 
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(202);
        let post = await Post.findOne({ 
            where   : { id: result.body.id },
            include : { model: Tag, as: 'tags' } 
        });

        instances.post2 = post;
        post.title.should.equal(fixtures.post2.title);
        post.userId.should.equal(instances.user.id);
        post.published.should.equal(false);
        post.tags.length.should.equal(0);
        should.not.exist(post.image);
        should.not.exist(post.content);

    });

    it('PUT: user/:userId/post should update post with all params', async () => {

        fixtures.post1 = postFixture.random();
        let result = await request({
            method                  : 'PUT',
            uri                     : config.api.url + `user/${instances.user.id}/post/${instances.post1.id}`,
            headers                 : { 
                'Content-Type' : 'application/json',
                'authorization': fixtures.userToken
             },
            body                    : {
                title      : fixtures.post1.title,
                image      : fixtures.post1.image,
                content    : fixtures.post1.content,
                published  : fixtures.post1.published,
                tags       : [instances.tag1.id]
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(202);
        let post = await Post.findOne({ 
            where   : { id: result.body.id },
            include : { model: Tag, as: 'tags' } 
        });

        instances.post1 = post;
        post.title.should.equal(fixtures.post1.title);
        post.userId.should.equal(instances.user.id);
        post.published.should.equal(fixtures.post1.published);
        post.image.should.equal(fixtures.post1.image);
        post.content.should.equal(fixtures.post1.content);
        post.tags.map(tag => tag.id).should.eql([instances.tag1.id]);

    });

    // GET
    it('GET: user/:userId/post/:id should return 400 when params are invalid', async () => {

        let result = await request({
            method                  : 'GET',
            uri                     : config.api.url + `user/xx/post/${instances.post1.id}`,
            headers                 : { 'authorization': fixtures.userToken },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(400);

    });

    it('GET: user/:userId/post/:id should return 401 for visitor when post is not published', async () => {

        instances.post1.published = false;
        await instances.post1.save();

        let result = await request({
            method                  : 'GET',
            uri                     : config.api.url + `user/${instances.user.id}/post/${instances.post1.id}`,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(401);

    });

    it('GET: user/:userId/post/:id should return unpublished post for its owner', async () => {

        let result = await request({
            method                  : 'GET',
            uri                     : config.api.url + `user/${instances.user.id}/post/${instances.post1.id}`,
            headers                 : { 'authorization': fixtures.userToken },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(200);
        result.body.id.should.equal(instances.post1.id);
        result.body.title.should.equal(instances.post1.title);

    });

    it('GET: user/:userId/post/:id should return published post for everyone', async () => {

        instances.post1.published = true;
        await instances.post1.save();

        let result = await request({
            method                  : 'GET',
            uri                     : config.api.url + `user/${instances.user.id}/post/${instances.post1.id}`,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(200);
        result.body.id.should.equal(instances.post1.id);
        result.body.title.should.equal(instances.post1.title);

    });

    // SEARCH
    it('GET: user/:userId/post/search should return 400 when params are invalid', async () => {

        let result = await request({
            method                  : 'GET',
            uri                     : config.api.url + `user/xx/posts/search`,
            headers                 : { 'authorization': fixtures.userToken },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(400);

    });

    it('GET: user/:userId/post/search should return published posts for visitor when search', async () => {

        instances.post1.published = false;
        instances.post2.published = true;
        await instances.post1.save();
        await instances.post2.save();

        let result = await request({
            method                  : 'GET',
            uri                     : config.api.url + `user/${instances.user.id}/posts/search`,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(200);
        result.body.length.should.aboveOrEqual(1);

        let postIds = result.body.map(post => post.id);
        postIds.indexOf(instances.post1.id).should.equal(-1);
        postIds.indexOf(instances.post2.id).should.aboveOrEqual(0);

    });

    it('GET: user/:userId/post/search should return both published or non published posts for user', async () => {

        let result = await request({
            method                  : 'GET',
            uri                     : config.api.url + `user/${instances.user.id}/posts/search`,
            headers                 : { 'authorization': fixtures.userToken },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(200);
        result.body.length.should.equal(2);

        let postIds = result.body.map(post => post.id);
        postIds.should.eql([instances.post1.id, instances.post2.id]);

    });

    it('GET: user/:userId/post/search should return posts by tags', async () => {

        await instances.post1.syncTags([instances.tag1.id, instances.tag2.id]);
        await instances.post2.syncTags([instances.tag2.id]);
        
        let resultTag1 = await request({
            method : 'GET',
            uri    : config.api.url + `user/${instances.user.id}/posts/search` + 
            `?tags[0]=${instances.tag1.id}`,
            headers                 : { 'authorization': fixtures.userToken },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        resultTag1.statusCode.should.equal(200);
        resultTag1.body.length.should.equal(1);
        resultTag1.body[0].id.should.equal(instances.post1.id);

        let resultBothTags = await request({
            method : 'GET',
            uri    : config.api.url + `user/${instances.user.id}/posts/search` + 
            `?tags[0]=${instances.tag1.id}&tags[1]=${instances.tag2.id}`,
            headers                 : { 'authorization': fixtures.userToken },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        resultBothTags.statusCode.should.equal(200);
        resultBothTags.body.length.should.equal(2);
        let postIds = resultBothTags.body.map(post => post.id);
        postIds.should.eql([instances.post1.id, instances.post2.id]);

    });

    // DELETE
    it('DELETE: user/:userId/post/:id should return 400 when params are invalid', async () => {

        let result = await request({
            method                  : 'DELETE',
            uri                     : config.api.url + `user/${instances.user.id}/post/XX`,
            headers                 : { 'authorization': fixtures.userToken },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(400);

    });

    it('DELETE: user/:userId/post/:id should return 401 when params are invalid', async () => {

        let result = await request({
            method                  : 'DELETE',
            uri                     : config.api.url + `user/${instances.user.id}/post/${instances.post1.id}`,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(401);

    });

    it('DELETE: user/:userId/post/:id should delete post', async () => {

        let result = await request({
            method                  : 'DELETE',
            uri                     : config.api.url + `user/${instances.user.id}/post/${instances.post1.id}`,
            headers                 : { 'authorization': fixtures.userToken },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(202);

    });

    // AFTER DELETION
    it('DELETE: user/:userId/post/:id should return 404 when post not found', async () => {
        
        let result = await request({
            method                  : 'DELETE',
            uri                     : config.api.url + `user/${instances.user.id}/post/${instances.post1.id}`,
            headers                 : { 'authorization': fixtures.userToken },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(404);

    });

    it('PUT: user/:userId/post should return 404 post not found', async () => {

        let result = await request({
            method                  : 'PUT',
            uri                     : config.api.url + `user/${instances.user.id}/post/${instances.post1.id}`,
            headers                 : { 'authorization': fixtures.userToken },
            body                    : {
                title : fixtures.post1.title
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(404);

    });

    it('Get: user/:userId/post/:id should return 404 post not found', async () => {
        
        let result = await request({
            method                  : 'GET',
            uri                     : config.api.url + `user/${instances.user.id}/post/${instances.post1.id}`,
            headers                 : { 'authorization': fixtures.userToken },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(404);

    });

    it('Get: user/:userId/post/search should return empty array when no post found', async () => {
        
        let result = await request({
            method : 'GET',
            uri    : config.api.url + `user/${instances.user.id}/posts/search` + 
            `?tags[0]=${instances.tag1.id}`,
            headers                 : { 'authorization': fixtures.userToken },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(200);
        result.body.length.should.equal(0);

    });
    

    after( async () => {

        await instances.user.destroy();
        await instances.tag1.destroy();
        await instances.tag2.destroy();
        await instances.post2.destroy();

    });

});