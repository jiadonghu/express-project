const Chance = require('chance');
const chance = new Chance();  

module.exports = {

    Random : () => {
        return {
            name : chance.word()
        };
    }

};