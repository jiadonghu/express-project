const Chance = require('chance');

module.exports = {

    RandomUser : () => {

        let chance = new Chance();
        let user = {
            email    : chance.email({ domain: 'testuser.com' }),
            name     : chance.name(),
            password : chance.string()
        };
        return user;
    }

};