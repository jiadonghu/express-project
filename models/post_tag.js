const Mysql       = require('../database').mysql;
const Sequelize   = require('sequelize');

const PostTag = Mysql.define('PostTag', {
    id : { 
        type          : Sequelize.INTEGER, 
        primaryKey    : true, 
        autoIncrement : true 
    },
    tag_id : {
        type      : Sequelize.INTEGER, 
        allowNull : false
    },
    post_id : {
        type      : Sequelize.INTEGER, 
        allowNull : false
    }
}, {
    tableName : 'post_tag',
    createdAt : false,
    updatedAt : false
});

module.exports = PostTag;