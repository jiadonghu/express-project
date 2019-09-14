const Mysql       = require('../database').mysql;
const Sequelize   = require('sequelize');
const Promise     = require('bluebird');
const HttpError   = require('http-errors'); 

const BlogPost = Mysql.define('BlogPost', {
    id : { 
        type          : Sequelize.INTEGER, 
        primaryKey    : true, 
        autoIncrement : true 
    },
    user_id : { 
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

BlogPost.prototype.syncTags = async function(new_tag_ids) {

    let tag_ids_clone = [...new_tag_ids];
    let db_post_tags = await PostTag.findAll({ where: { post_id: this.id } });

    for (let item of db_post_tags) {
        if (tag_ids_clone.indexOf(item.id) == -1) {
            await item.destroy();
        } else {
            tag_ids_clone.splice(tag_ids_clone.indexOf(item.id), 1);
        }
    }
   
    for (let tag_id of tag_ids_clone) {
        await PostTag.create({
            post_id : this.id,
            tag_id  : tag_id
        });
    }
};

module.exports = BlogPost;

const Tag     = require('./tag');
const PostTag = require('./post_tag');

// association
BlogPost.belongsToMany(Tag, { as: 'tags', through: 'post_tag', foreignKey: 'post_id', otherKey: 'tag_id' });
BlogPost.hasMany(PostTag, { foreignKey: 'post_id', onDelete: 'CASCADE', hooks : true });