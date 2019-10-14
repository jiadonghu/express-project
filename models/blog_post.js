const { mysql }   = require('../database');
const Sequelize   = require('sequelize');
const HttpError   = require('http-errors'); 

const Post = mysql.define('Post', {
    id : { 
        type          : Sequelize.INTEGER, 
        primaryKey    : true, 
        autoIncrement : true 
    },
    userId : { 
        type      : Sequelize.INTEGER, 
        allowNull : false
    },
    title : {
        type      : Sequelize.STRING(100),
        allowNull : false
    },
    image : {
        type : Sequelize.STRING(255)
    },
    content : {
        type      : Sequelize.TEXT
    },
    published : {
        type      : Sequelize.BOOLEAN,
        allowNull : false
    }
}, {
    tableName : 'blog_post',
    createdAt : false,
    updatedAt : false
});

// Instance Methods

Post.prototype.syncTags = async function(newTagIds) {

    let tagIdsClone = [...newTagIds];
    let dbPostTags = await PostTag.findAll({ where: { postId: this.id } });

    for (let item of dbPostTags) {
        if (tagIdsClone.indexOf(item.id) == -1) {
            await item.destroy();
        } else {
            tagIdsClone.splice(tagIdsClone.indexOf(item.id), 1);
        }
    }
   
    for (let tagId of tagIdsClone) {
        await PostTag.create({
            postId : this.id,
            tagId  : tagId
        });
    }
};

module.exports = Post;

const Tag     = require('./tag');
const PostTag = require('./post_tag');

// association
Post.belongsToMany(Tag, { as: 'tags', through: 'post_tag', foreignKey: 'postId', otherKey: 'tagId' });
Post.hasMany(PostTag, { foreignKey: 'postId', onDelete: 'CASCADE', hooks : true });