// set env param as test 
process.env.NODE_ENV = 'test';

const User        = require('../../models/user');
const Should      = require('should');
const UserFixture = require('../fixtures/user');

describe('Model User:', () => {

    let fixtures = {
        test_user_1 : UserFixture.RandomUser(),
        test_user_2 : UserFixture.RandomUser()
    };
    
    let instance = {};

    it('User.create should create new user', async () => {

        let user_1 = await User.create(fixtures.test_user_1);
        let user_2 = await User.create(fixtures.test_user_2);
        Should.exist(user_1.id);
        Should.exist(user_2.id);
        instance.test_user_1 = user_1;
        instance.test_user_2 = user_2;

    });

    it('User.findOne should find user', async () => {

        let user = await User.findOne({
            where : { email: instance.test_user_1.email }
        });

        Should.exist(user);
        user.email.should.equal(instance.test_user_1.email);

     });

    it('User.findAll should find all users', async () => {

        let users = await User.findAll({
            where : { id: [instance.test_user_1.id, instance.test_user_2.id] }
        });

        users.length.should.equal(2);

     });

    it('user.save should save user', async () => {
        
        let another_user = UserFixture.RandomUser();
        
        instance.test_user_1.name = another_user.name;
        await instance.test_user_1.save();

        let updated_user = await User.findOne({
             where : { id: instance.test_user_1.id }
        });
        updated_user.name.should.equal(another_user.name);
        instance.test_user_1 = updated_user;

    });

    it('user.destroy should delete user', async () => {

        await instance.test_user_1.destroy();
        await instance.test_user_2.destroy();

        let users = await User.findAll({
            where : { id: [instance.test_user_1.id, instance.test_user_2.id] }
        });

        users.length.should.equal(0);

    });

});