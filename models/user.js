const Mysql = require('../database').mysql;
const Sequelize = require('sequelize');

const User = Mysql.define('User', {
    id : { 
        type          : Sequelize.INTEGER, 
        primaryKey    : true, 
        autoIncrement : true 
    },
    email : { 
        type      : Sequelize.STRING(320),
        unique    : true,
        allowNull : false,
        validate  : {
            isEmail: true,  
        }
    },
    name : {
        type : Sequelize.STRING(100),
    },
    password : {
        type      : Sequelize.STRING(100),
        allowNull : false,
    }
}, {
    tableName : 'user',
    createdAt : false,
    updatedAt : false
});

module.exports = User;