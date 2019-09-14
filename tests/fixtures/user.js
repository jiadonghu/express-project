const Chance = require('chance');
const chance = new Chance();  

module.exports = {

    Random : () => {
        return {
            email    : chance.email({ domain: 'testuser.com' }),
            name     : chance.name(),
            password : chance.string()
        };
    }

};