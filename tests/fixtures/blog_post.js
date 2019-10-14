const Chance = require('chance');
const chance = new Chance();  

module.exports = {

    random : (userId = 0) => {
        return {
            userId   : userId,
            title     : chance.sentence({ words: Math.floor(Math.random() * 5) + 1 }),
            image     : chance.url({ protocol: 'https', extensions: ['gif', 'jpg', 'png'] }),
            published : chance.bool(),
            content   : chance.paragraph()
        };
    }

};