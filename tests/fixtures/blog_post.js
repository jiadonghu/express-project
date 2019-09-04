const Chance = require('chance');
const chance = new Chance();  

module.exports = {

    Random : (user_id = 0) => {
        return {
            user_id   : user_id,
            title     : chance.sentence({ words: parseInt(Math.random() * 5) + 1 }),
            image     : chance.url({extensions: ['gif', 'jpg', 'png']}),
            published : chance.bool(),
            content   : chance.paragraph()
        };
    }

};