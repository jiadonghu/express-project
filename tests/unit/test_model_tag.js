// set env param as test 
process.env.NODE_ENV = 'test';

const {Tag} = require('../../models');
const {TagFixture} = require('../fixtures');
const Should = require('should');

describe('Model Tag:', () => {

    let fixtures = {
        tag_1 : TagFixture.Random(),
        tag_2 : TagFixture.Random()
    };

    let instances = {};

    it('Tag.create should create new tag', async () => {

        let tag_1 = await Tag.create(fixtures.tag_1);
        let tag_2 = await Tag.create(fixtures.tag_2);
        Should.exist(tag_1.id);
        Should.exist(tag_2.id);
        instances.tag_1 = tag_1;
        instances.tag_2 = tag_2;

    });

    it('Tag.findOne should find one tag', async () => {

        let tag_1 = await Tag.findOne({
            where : { id: instances.tag_1.id }
        });
        let tag_2 = await Tag.findOne({
            where : { id: instances.tag_2.id }
        });
        tag_1.id.should.eql(instances.tag_1.id);
        tag_1.name.should.eql(instances.tag_1.name);
        
        tag_2.id.should.eql(instances.tag_2.id);
        tag_2.name.should.eql(instances.tag_2.name);
        
    });

    it('Tag.findAll should find all tags', async () => {

        let tags = await Tag.findAll({
            where : { id: [instances.tag_1.id, instances.tag_2.id] }
        });

        tags.length.should.equal(2);
        
        tags.map(tag => tag.id).should.eql([instances.tag_1.id, instances.tag_2.id]);

    });

    it('tag.save should save', async () => {
        
        instances.tag_1.name = TagFixture.Random().name;
        await instances.tag_1.save();

        let updated_tag = await Tag.findOne({
             where : { id: instances.tag_1.id }
        });
        instances.tag_1.name.should.equal(updated_tag.name);

    });

    it('Tag.SearchByName should search by tag name', async () => {
        
        let tags = await Tag.SearchByName(
            instances.tag_1.name.substring(1, instances.tag_1.name.length - 1)
        );
        
        tags.map(tag => tag.name).indexOf(instances.tag_1.name).should.aboveOrEqual(0);

    });

    it('tag.destroy should delete tag', async () => {

        await instances.tag_1.destroy();
        await instances.tag_2.destroy();

        let tags = await Tag.findAll({
            where : { id: [instances.tag_1.id, instances.tag_1.id] }
        });

        tags.length.should.equal(0);

    });

});