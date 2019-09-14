const Chance = require('chance');
const chance = new Chance();  

module.exports = {

    Random : (user_id = 0) => {
        return {
            user_id   : user_id,
            title     : chance.sentence({ words: Math.floor(Math.random() * 5) + 1 }),
            image     : chance.url({ protocol: 'https', extensions: ['gif', 'jpg', 'png'] }),
            published : chance.bool(),
            content   : chance.paragraph()
        };
    }

};