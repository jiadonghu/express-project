// set env param as test 
process.env.NODE_ENV = 'test';

const {BlogPost, Tag, PostTag, User}         = require('../../models');
const {UserFixture, PostFixture, TagFixture} = require('../fixtures');
const Should                                 = require('should');
const Request                                = require('request-promise');
const Promise                                = require('bluebird');
const Jwt                                    = require('jsonwebtoken');
const Permissions                            = require('../../utils/permissions');
const Config                                 = require('../../config');


describe('Controller Post', () => {

    let fixtures = {
        user   : UserFixture.Random(),
        tag_1  : TagFixture.Random(),
        tag_2  : TagFixture.Random(),
        post_1 : PostFixture.Random(),
        post_2 : PostFixture.Random()
    };
    let instances = {};

    before(async () => {
        // start service
        let app = require('../../app');

        instances.user = await User.create(fixtures.user);
        instances.tag_1 = await Tag.create(fixtures.tag_1);
        instances.tag_2 = await Tag.create(fixtures.tag_2);

        fixtures.user_token = Jwt.sign(
            { 
                user_id     : instances.user.id, 
                permissions : [
                    Permissions.VISITOR,
                    Permissions.VALID_USER(instances.user.id)
                ] 
            },
            Config.jwt.secret,
            { expiresIn: 60 }
        );
        fixtures.visitor_token = Jwt.sign(
            { 
                permissions : [
                    Permissions.VISITOR
                ] 
            },
            Config.jwt.secret,
            { expiresIn: 60 }
        );
        await Promise.delay(1000);
    });

    // CREATE
    it('POST: user/:user_id/post should return 400 when params are invalid', async () => {

            let result = await Request({
                method                  : 'POST',
                uri                     : Config.api.url + `user/${instances.user.id}/post`,
                headers                 : { 'authorization': fixtures.user_token },
                body                    : {},
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(400);

    });

    it('POST: user/:user_id/post should return 401 when user permission is incorrect', async () => {

            let result = await Request({
                method                  : 'POST',
                uri                     : Config.api.url + `user/${instances.user.id + 1}/post`,
                headers                 : { 'authorization': fixtures.user_token },
                body                    : {
                    title : fixtures.post_1.title 
                },
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(401);

    });

    it('POST: user/:user_id/post should create post with minimum params', async () => {

            let result = await Request({
                method                  : 'POST',
                uri                     : Config.api.url + `user/${instances.user.id}/post`,
                headers                 : { 'authorization': fixtures.user_token },
                body                    : {
                    title : fixtures.post_1.title 
                },
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(201);

            let post = await BlogPost.findOne({ 
                where   : { id: result.body.id },
                include : { model: Tag, as: 'tags' } 
            });

            instances.post_1 = post;
            post.title.should.equal(fixtures.post_1.title);
            post.user_id.should.equal(instances.user.id);
            post.published.should.equal(false);
            post.tags.length.should.equal(0);
            Should.not.exist(post.image);
            Should.not.exist(post.content);

    });

    it('POST: user/:user_id/post should create post with all params', async () => {

            let result = await Request({
                method                  : 'POST',
                uri                     : Config.api.url + `user/${instances.user.id}/post`,
                headers                 : { 'authorization': fixtures.user_token },
                body                    : {
                    title      : fixtures.post_2.title,
                    image      : fixtures.post_2.image,
                    content    : fixtures.post_2.content,
                    published  : fixtures.post_2.published,
                    tags       : [instances.tag_1.id, instances.tag_2.id]
                },
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(201);
            
            let post = await BlogPost.findOne({ 
                where   : { id: result.body.id },
                include : { model: Tag, as: 'tags' } 
            });

            instances.post_2 = post;
            post.title.should.equal(fixtures.post_2.title);
            post.user_id.should.equal(instances.user.id);
            post.published.should.equal(fixtures.post_2.published);
            post.image.should.equal(fixtures.post_2.image);
            post.content.should.equal(fixtures.post_2.content);
            post.tags.map(tag => tag.id).should.eql([instances.tag_1.id, instances.tag_2.id]);
        
    });

    // UPDATE 
    it('PUT: user/:user_id/post should return 400 when params are invalid', async () => {

            let result = await Request({
                method                  : 'PUT',
                uri                     : Config.api.url + `user/${instances.user.id}/post/${instances.post_1.id}`,
                headers                 : { 'authorization': fixtures.user_token },
                body                    : {
                    title : { title: 'test' }
                },
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(400);

    });

    it('PUT: user/:user_id/post should return 401 user permission is incorrect', async () => {

            let result = await Request({
                method                  : 'PUT',
                uri                     : Config.api.url + `user/${instances.user.id + 1}/post/${instances.post_1.id}`,
                headers                 : { 'authorization': fixtures.user_token },
                body                    : {
                    title : fixtures.post_1.title
                },
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(401);

    });

    it('PUT: user/:user_id/post should update post with minimum params', async () => {

        fixtures.post_2.title = PostFixture.Random().title;
        let result = await Request({
            method                  : 'PUT',
            uri                     : Config.api.url + `user/${instances.user.id}/post/${instances.post_2.id}`,
            headers                 : { 'authorization': fixtures.user_token },
            body                    : {
                title : fixtures.post_2.title 
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(202);
        let post = await BlogPost.findOne({ 
            where   : { id: result.body.id },
            include : { model: Tag, as: 'tags' } 
        });

        instances.post_2 = post;
        post.title.should.equal(fixtures.post_2.title);
        post.user_id.should.equal(instances.user.id);
        post.published.should.equal(false);
        post.tags.length.should.equal(0);
        Should.not.exist(post.image);
        Should.not.exist(post.content);

    });

    it('PUT: user/:user_id/post should update post with all params', async () => {

        fixtures.post_1 = PostFixture.Random();
        let result = await Request({
            method                  : 'PUT',
            uri                     : Config.api.url + `user/${instances.user.id}/post/${instances.post_1.id}`,
            headers                 : { 
                'Content-Type' : 'application/json',
                'authorization': fixtures.user_token
             },
            body                    : {
                title      : fixtures.post_1.title,
                image      : fixtures.post_1.image,
                content    : fixtures.post_1.content,
                published  : fixtures.post_1.published,
                tags       : [instances.tag_1.id]
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(202);
        let post = await BlogPost.findOne({ 
            where   : { id: result.body.id },
            include : { model: Tag, as: 'tags' } 
        });

        instances.post_1 = post;
        post.title.should.equal(fixtures.post_1.title);
        post.user_id.should.equal(instances.user.id);
        post.published.should.equal(fixtures.post_1.published);
        post.image.should.equal(fixtures.post_1.image);
        post.content.should.equal(fixtures.post_1.content);
        post.tags.map(tag => tag.id).should.eql([instances.tag_1.id]);

    });

    // GET
    it('GET: user/:user_id/post/:id should return 400 when params are invalid', async () => {

        let result = await Request({
            method                  : 'GET',
            uri                     : Config.api.url + `user/xx/post/${instances.post_1.id}`,
            headers                 : { 'authorization': fixtures.user_token },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(400);

    });

    it('GET: user/:user_id/post/:id should return 401 for visitor when post is not published', async () => {

        instances.post_1.published = false;
        await instances.post_1.save();

        let result = await Request({
            method                  : 'GET',
            uri                     : Config.api.url + `user/${instances.user.id}/post/${instances.post_1.id}`,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(401);

    });

    it('GET: user/:user_id/post/:id should return unpublished post for its owner', async () => {

        let result = await Request({
            method                  : 'GET',
            uri                     : Config.api.url + `user/${instances.user.id}/post/${instances.post_1.id}`,
            headers                 : { 'authorization': fixtures.user_token },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(200);
        result.body.id.should.equal(instances.post_1.id);
        result.body.title.should.equal(instances.post_1.title);

    });

    it('GET: user/:user_id/post/:id should return published post for everyone', async () => {

        instances.post_1.published = true;
        await instances.post_1.save();

        let result = await Request({
            method                  : 'GET',
            uri                     : Config.api.url + `user/${instances.user.id}/post/${instances.post_1.id}`,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(200);
        result.body.id.should.equal(instances.post_1.id);
        result.body.title.should.equal(instances.post_1.title);

    });

    // SEARCH
    it('GET: user/:user_id/post/search should return 400 when params are invalid', async () => {

        let result = await Request({
            method                  : 'GET',
            uri                     : Config.api.url + `user/xx/posts/search`,
            headers                 : { 'authorization': fixtures.user_token },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(400);

    });

    it('GET: user/:user_id/post/search should return 401 for visitor when search for all posts', async () => {

        let result = await Request({
            method                  : 'GET',
            uri                     : Config.api.url + `user/${instances.user.id}/posts/search`,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(401);

    });

    it('GET: user/:user_id/post/search should return posts for visitor when search for published posts only', async () => {

        instances.post_1.published = false;
        instances.post_2.published = true;
        await instances.post_1.save();
        await instances.post_2.save();

        let result = await Request({
            method : 'GET',
            uri    : Config.api.url + `user/${instances.user.id}/posts/search` + 
            `?published=true`,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(200);
        result.body.length.should.aboveOrEqual(1);

        let post_ids = result.body.map(post => post.id);
        post_ids.indexOf(instances.post_1.id).should.equal(-1);
        post_ids.indexOf(instances.post_2.id).should.aboveOrEqual(0);

    });

    it('GET: user/:user_id/post/search should return both published or non published posts for user', async () => {

        let result = await Request({
            method                  : 'GET',
            uri                     : Config.api.url + `user/${instances.user.id}/posts/search`,
            headers                 : { 'authorization': fixtures.user_token },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(200);
        result.body.length.should.equal(2);

        let post_ids = result.body.map(post => post.id);
        post_ids.should.eql([instances.post_1.id, instances.post_2.id]);

    });

    it('GET: user/:user_id/post/search should return posts by tags', async () => {

        await instances.post_1.syncTags([instances.tag_1.id, instances.tag_2.id]);
        await instances.post_2.syncTags([instances.tag_2.id]);
        
        let result_tag_1 = await Request({
            method : 'GET',
            uri    : Config.api.url + `user/${instances.user.id}/posts/search` + 
            `?tags[0]=${instances.tag_1.id}`,
            headers                 : { 'authorization': fixtures.user_token },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result_tag_1.statusCode.should.equal(200);
        result_tag_1.body.length.should.equal(1);
        result_tag_1.body[0].id.should.equal(instances.post_1.id);

        let result_both_tags = await Request({
            method : 'GET',
            uri    : Config.api.url + `user/${instances.user.id}/posts/search` + 
            `?tags[0]=${instances.tag_1.id}&tags[1]=${instances.tag_2.id}`,
            headers                 : { 'authorization': fixtures.user_token },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result_both_tags.statusCode.should.equal(200);
        result_both_tags.body.length.should.equal(2);
        let post_ids = result_both_tags.body.map(post => post.id);
        post_ids.should.eql([instances.post_1.id, instances.post_2.id]);

    });

    // DELETE
    it('DELETE: user/:user_id/post/:id should return 400 when params are invalid', async () => {

        let result = await Request({
            method                  : 'DELETE',
            uri                     : Config.api.url + `user/${instances.user.id}/post/XX`,
            headers                 : { 'authorization': fixtures.user_token },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(400);

    });

    it('DELETE: user/:user_id/post/:id should return 401 when params are invalid', async () => {

        let result = await Request({
            method                  : 'DELETE',
            uri                     : Config.api.url + `user/${instances.user.id}/post/${instances.post_1.id}`,
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(401);

    });

    it('DELETE: user/:user_id/post/:id should delete post', async () => {

        let result = await Request({
            method                  : 'DELETE',
            uri                     : Config.api.url + `user/${instances.user.id}/post/${instances.post_1.id}`,
            headers                 : { 'authorization': fixtures.user_token },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(202);

    });

    // AFTER DELETION
    it('DELETE: user/:user_id/post/:id should return 404 when post not found', async () => {
        
        let result = await Request({
            method                  : 'DELETE',
            uri                     : Config.api.url + `user/${instances.user.id}/post/${instances.post_1.id}`,
            headers                 : { 'authorization': fixtures.user_token },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(404);

    });

    it('PUT: user/:user_id/post should return 404 post not found', async () => {

        let result = await Request({
            method                  : 'PUT',
            uri                     : Config.api.url + `user/${instances.user.id}/post/${instances.post_1.id}`,
            headers                 : { 'authorization': fixtures.user_token },
            body                    : {
                title : fixtures.post_1.title
            },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(404);

    });

    it('Get: user/:user_id/post/:id should return 404 post not found', async () => {
        
        let result = await Request({
            method                  : 'GET',
            uri                     : Config.api.url + `user/${instances.user.id}/post/${instances.post_1.id}`,
            headers                 : { 'authorization': fixtures.user_token },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(404);

    });

    it('Get: user/:user_id/post/search should return empty array when no post found', async () => {
        
        let result = await Request({
            method : 'GET',
            uri    : Config.api.url + `user/${instances.user.id}/posts/search` + 
            `?tags[0]=${instances.tag_1.id}`,
            headers                 : { 'authorization': fixtures.user_token },
            json                    : true,
            resolveWithFullResponse : true,
            simple                  : false
        });

        result.statusCode.should.equal(200);
        result.body.length.should.equal(0);

    });
    

    after( async () => {

        await instances.user.destroy();
        await instances.tag_1.destroy();
        await instances.tag_2.destroy();
        await instances.post_2.destroy();

    });

});