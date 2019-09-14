const Chance = require('chance');
const chance = new Chance();  

module.exports = {

    Random : () => {
        return {
            // never rturn the same name
            name : chance.guid().toString()
        };
    }

};