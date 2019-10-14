const { mysql }   = require('../database');
const Sequelize   = require('sequelize');
const Op          = Sequelize.Op;

const Tag = mysql.define('Tag', {
    id : { 
        type          : Sequelize.INTEGER, 
        primaryKey    : true, 
        autoIncrement : true 
    },
    name : {
        type : Sequelize.STRING(100),
    },
    // createdAt : {
    //     type: Sequelize.DATE
    // },
    // updatedAt : {
    //     type: Sequelize.DATE
    // }
}, {
    tableName : 'tag',
    createdAt : false,
    updatedAt : false,
});

Tag.searchByName = async (name = '') => {
    return await Tag.findAll({
        where : {
          name : {
            [Op.like]: '%' + name + '%'
          }
        }
      });
};

module.exports = Tag;

const Post = require('./blog_post');

Tag.belongsToMany(Post, { through: 'post_tag', foreignKey: 'tagId', otherKey: 'postId' });