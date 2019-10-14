// set env param as test 
process.env.NODE_ENV = 'test';

const {User}        = require('../../models');
const should        = require('should');
const {userFixture} = require('../fixtures');

describe('Model User:', () => {

    let fixtures = {
        testUser1 : userFixture.random(),
        testUser2 : userFixture.random()
    };
    
    let instance = {};

    it('User.create should create new user', async () => {

        let user1 = await User.create(fixtures.testUser1);
        let user2 = await User.create(fixtures.testUser2);
        should.exist(user1.id);
        should.exist(user2.id);
        instance.testUser1 = user1;
        instance.testUser2 = user2;

    });

    it('User.findOne should find user', async () => {

        let user = await User.findOne({
            where : { email: instance.testUser1.email }
        });

        should.exist(user);
        user.email.should.equal(instance.testUser1.email);

     });

    it('User.findAll should find all users', async () => {

        let users = await User.findAll({
            where : { id: [instance.testUser1.id, instance.testUser2.id] }
        });

        users.length.should.equal(2);

     });

    it('user.save should save user', async () => {
        
        let anotherUser = userFixture.random();
        
        instance.testUser1.name = anotherUser.name;
        await instance.testUser1.save();

        let updatedUser = await User.findOne({
             where : { id: instance.testUser1.id }
        });
        updatedUser.name.should.equal(anotherUser.name);
        instance.testUser1 = updatedUser;

    });

    it('user.destroy should delete user', async () => {

        await instance.testUser1.destroy();
        await instance.testUser2.destroy();

        let users = await User.findAll({
            where : { id: [instance.testUser1.id, instance.testUser2.id] }
        });

        users.length.should.equal(0);

    });

});