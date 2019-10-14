// set env param as test 
process.env.NODE_ENV = 'test';

const request                   = require('request-promise');
const should                    = require('should');
const promise                   = require('bluebird');
const jwt                       = require('jsonwebtoken');
const permissions               = require('../../utils/permissions');
const config                    = require('../../config');
const {Tag, User}               = require('../../models');
const {userFixture, tagFixture} = require('../fixtures');

describe('Controller Tag', () => {
    
        let fixtures = {
            user : userFixture.random(),
            tag1 : tagFixture.random(),
            tag2 : tagFixture.random()
        };
    
        let instances = {};
    
        before(async () => {
            // start service
            let app = require('../../app');

            instances.user = await User.create(fixtures.user);
            instances.tag1 = await Tag.create(fixtures.tag1);
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

        it('Post: /tag should return 400 when params are invalid', async () => {

            let result = await request({
                method                  : 'POST',
                uri                     : config.api.url + 'tag',
                headers                 : { 'authorization': fixtures.userToken },
                body                    : {},
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(400);

        });

        it('Post: /tag should return 401 when permission are correct', async () => {

            let result = await request({
                method                  : 'POST',
                uri                     : config.api.url + 'tag',
                headers                 : { 'authorization': fixtures.visitorToken },
                body                    : { name: fixtures.tag1 },
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(401);

        });

        it('Post: /tag should create tag', async () => {

            let result = await request({
                method                  : 'POST',
                uri                     : config.api.url + 'tag',
                headers                 : { 'authorization': fixtures.userToken },
                body                    : { name: fixtures.tag2.name },
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(201);
        
            should.exist(result.body.id);
            let tag = await Tag.findOne({ where: { id: result.body.id } });
            tag.name.should.equal(fixtures.tag2.name);
            instances.tag2 = tag;
        });

        it('Get: /tags/search should return 400 when query is too long', async () => {

            let result = await request({
                method                  : 'GET',
                uri                     : config.api.url + 'tags/search?name=' + 'i'.repeat(101),
                headers                 : {},
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(400);

        });

        it('Get: /tags/search should search tags by name', async () => {

            let result = await request({
                method                  : 'GET',
                uri                     : config.api.url + 'tags/search?name=' + instances.tag1.name,
                headers                 : {},
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(200);
            result.body.length.should.equal(1);
            result.body[0].name.should.equal(instances.tag1.name);
        });

        it('Get: /tags/search should list all tags when no query provided', async () => {

            let result = await request({
                method                  : 'GET',
                uri                     : config.api.url + 'tags/search',
                headers                 : {},
                json                    : true,
                resolveWithFullResponse : true,
                simple                  : false
            });
    
            result.statusCode.should.equal(200);
            let names = result.body.map(item => item.name);
            names.indexOf(instances.tag1.name).should.aboveOrEqual(0);
            names.indexOf(instances.tag2.name).should.aboveOrEqual(0);
        });

        after(async () => {

            await instances.user.destroy();
            await instances.tag1.destroy();
            await instances.tag2.destroy();
            
        });
})