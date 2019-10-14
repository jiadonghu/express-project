// set env param as test 
process.env.NODE_ENV = 'test';

const { Tag } = require('../../models');
const { tagFixture } = require('../fixtures');
const should = require('should');

describe('Model Tag:', () => {

    let fixtures = {
        tag1 : tagFixture.random(),
        tag2 : tagFixture.random()
    };

    let instances = {};

    it('Tag.create should create new tag', async () => {

        let tag1 = await Tag.create(fixtures.tag1);
        let tag2 = await Tag.create(fixtures.tag2);
        should.exist(tag1.id);
        should.exist(tag2.id);
        instances.tag1 = tag1;
        instances.tag2 = tag2;

    });

    it('Tag.findOne should find one tag', async () => {

        let tag1 = await Tag.findOne({
            where : { id: instances.tag1.id }
        });
        let tag2 = await Tag.findOne({
            where : { id: instances.tag2.id }
        });
        tag1.id.should.eql(instances.tag1.id);
        tag1.name.should.eql(instances.tag1.name);
        
        tag2.id.should.eql(instances.tag2.id);
        tag2.name.should.eql(instances.tag2.name);
        
    });

    it('Tag.findAll should find all tags', async () => {

        let tags = await Tag.findAll({
            where : { id: [instances.tag1.id, instances.tag2.id] }
        });

        tags.length.should.equal(2);
        
        tags.map(tag => tag.id).should.eql([instances.tag1.id, instances.tag2.id]);

    });

    it('tag.save should save', async () => {
        
        instances.tag1.name = tagFixture.random().name;
        await instances.tag1.save();

        let updatedTag = await Tag.findOne({
             where : { id: instances.tag1.id }
        });
        instances.tag1.name.should.equal(updatedTag.name);

    });

    it('Tag.searchByName should search by tag name', async () => {
        
        let tags = await Tag.searchByName(
            instances.tag1.name.substring(1, instances.tag1.name.length - 1)
        );
        
        tags.map(tag => tag.name).indexOf(instances.tag1.name).should.aboveOrEqual(0);

    });

    it('tag.destroy should delete tag', async () => {

        await instances.tag1.destroy();
        await instances.tag2.destroy();

        let tags = await Tag.findAll({
            where : { id: [instances.tag1.id, instances.tag1.id] }
        });

        tags.length.should.equal(0);

    });

});