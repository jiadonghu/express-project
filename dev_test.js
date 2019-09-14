// const BlogPost = require('./blog_post');
// const Tag      = require('./tag');
// const PostTag  = require('./post_tag');

// const Models   = require('./models');
const {Tag, BlogPost} = require('./models');
const Chance = require('chance');
const chance = new Chance();  

Array(100).fill(1).forEach(i => {
    console.log(chance.url({ protocol: 'https', extensions: ['gif', 'jpg', 'png'] }))
})
