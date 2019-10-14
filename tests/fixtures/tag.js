const Chance = require('chance');
const chance = new Chance();  

module.exports = {

    random : () => {
        return {
            // never rturn the same name
            name : chance.guid().toString()
        };
    }

};