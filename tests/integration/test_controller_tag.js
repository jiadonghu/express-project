// set env param as test 
process.env.NODE_ENV = 'test';

const Request                   = require('request-promise');
const Should                    = require('should');
const Promise                   = require('bluebird');
const Jwt                       = require('jsonwebtoken');
const Chance                    = require('chance'); 
const Permissions               = require('../../utils/permissions');
const Config                    = require('../../config');
const {Tag, User}               = require('../../models');
const {UserFixture, TagFixture} = require('../fixtures');

describe('Controller Tag', () => {
    
        let fixtures = {
            user  : UserFixture.Random(),
            tag_1 : TagFixture.Random(),
            tag_2 : TagFixture.Random()
        };
    
        let instances = {};
    
        before(async () => {
            // start service
            let app = require('../../app');

            instances.user = await User.create(fixtures.user);
            instances.tag_1 = await Tag.create(fixtures.tag_1);
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

        it('Post: /tag should return 400 when params are invalid', async () => {

            let result = await Request({
                method                  : 'POST',
                uri                     : Config.api.url + 'tag',
                headers                 : { 'authorization': fixtures.user_token },
                body                    : {},
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(400);

        });

        it('Post: /tag should return 401 when permission are correct', async () => {

            let result = await Request({
                method                  : 'POST',
                uri                     : Config.api.url + 'tag',
                headers                 : { 'authorization': fixtures.visitor_token },
                body                    : { name : fixtures.tag_1 },
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(401);

        });

        it('Post: /tag should create tag', async () => {

            let result = await Request({
                method                  : 'POST',
                uri                     : Config.api.url + 'tag',
                headers                 : { 'authorization': fixtures.user_token },
                body                    : { name: fixtures.tag_2.name },
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(201);
        
            Should.exist(result.body.id);
            let tag = await Tag.findOne({ where: { id: result.body.id } });
            tag.name.should.equal(fixtures.tag_2.name);
            instances.tag_2 = tag;
        });

        it('Get: /tags/search should return 400 when query is too long', async () => {

            let result = await Request({
                method                  : 'GET',
                uri                     : Config.api.url + 'tags/search?name=' + 'i'.repeat(101),
                headers                 : {},
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(400);

        });

        it('Get: /tags/search should search tags by name', async () => {

            let result = await Request({
                method                  : 'GET',
                uri                     : Config.api.url + 'tags/search?name=' + instances.tag_1.name,
                headers                 : {},
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(200);
            result.body.length.should.equal(1);
            result.body[0].name.should.equal(instances.tag_1.name);
        });

        it('Get: /tags/search should list all tags when no query provided', async () => {

            let result = await Request({
                method                  : 'GET',
                uri                     : Config.api.url + 'tags/search',
                headers                 : {},
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(200);
            let names = result.body.map(item => item.name);
            names.indexOf(instances.tag_1.name).should.aboveOrEqual(0);
            names.indexOf(instances.tag_2.name).should.aboveOrEqual(0);
        });

        after(async () => {

            await instances.user.destroy();
            await instances.tag_1.destroy();
            await instances.tag_2.destroy();
            
        });
})