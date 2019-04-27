const Mysql       = require('../database').mysql;
const Sequelize   = require('sequelize');

module.exports = Mysql.define('User', {
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
            isEmail : true,  
        }
    },
    name : {
        type : Sequelize.STRING(100),
    },
    password : {
        type      : Sequelize.TEXT,
        allowNull : false,
    }
}, {
    tableName : 'user',
    createdAt : false,
    updatedAt : false
});