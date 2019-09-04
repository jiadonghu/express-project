// const BlogPost = require('./blog_post');
// const Tag      = require('./tag');
// const PostTag  = require('./post_tag');

// const Models   = require('./models');
const {Tag, BlogPost} = require('./models');
//BlogPost.belongsToMany(Tag, { through: PostTag, foreignKey: 'post_id', otherKey: 'tag_id' });

// BlogPost.findAll({
//     include: [{
//         model: Tag,    
//         where: { name: ['name 1', 'name 2'] }
//     }]
// })
// .then(result => {
//     console.log(JSON.stringify(result));
// });

// BlogPost.findOne({
//     where : { id: 1 }
// })
// .then(post => {
//     // posts.forEach(post => {
//     //     console.log(post.tags);
//     // })
//     console.log(post.tags);
// })

// Tag.findAll({
//     include: [{
//         model: BlogPost,    
//         where: { id: 2 },
//         attributes : []
//     }]
// })
// .then(tags => {
//     console.log(JSON.stringify(tags));
// })

// BlogPost.create({
//     user_id : 1,
//     title : 'test',
//     published : 1,
//     content : 'no'
// })
//     .then(post => {
//         return PostTag.create({
//             post_id : post.id,
//             tag_id  : 1
//         });
//     })


// console.log(BlogPost);
// console.log(Tag);

BlogPost.findAll({
    include: {
        model      : Tag,    
        where      : { name: 'name 1' },
        as         : 'tags',
        attributes : []
    }
  //  include : { model: Tag, as: 'tags'} 
})
    .then(posts => {
        console.log(JSON.stringify(posts))
        //return post.addTag(1)
    })

