const Mysql       = require('../database').mysql;
const Sequelize   = require('sequelize');

const Tag = Mysql.define('Tag', {
    id : { 
        type          : Sequelize.INTEGER, 
        primaryKey    : true, 
        autoIncrement : true 
    },
    name : {
        type : Sequelize.STRING(100),
    }
}, {
    tableName : 'tag',
    createdAt : false,
    updatedAt : false,
});

module.exports = Tag;

const BlogPost = require('./blog_post');

Tag.belongsToMany(BlogPost, { through: 'post_tag', foreignKey: 'tag_id', otherKey: 'post_id' });