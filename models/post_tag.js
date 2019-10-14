const { mysql }   = require('../database');
const Sequelize   = require('sequelize');

const PostTag = mysql.define('PostTag', {
    id : { 
        type          : Sequelize.INTEGER, 
        primaryKey    : true, 
        autoIncrement : true 
    },
    tagId : {
        type      : Sequelize.INTEGER, 
        allowNull : false
    },
    postId : {
        type      : Sequelize.INTEGER, 
        allowNull : false
    },
    // createdAt : {
    //     type: Sequelize.DATE
    // },
    // updatedAt : {
    //     type: Sequelize.DATE
    // }
}, {
    tableName : 'post_tag',
    createdAt : false,
    updatedAt : false
});

module.exports = PostTag;