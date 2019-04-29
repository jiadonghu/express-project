const Sequelize = require('sequelize');
const Config = require('./config');

let db_instance = new Sequelize({
  database : Config.mysql.database,
  username : Config.mysql.username,
  password : Config.mysql.password,
  host     : Config.mysql.host,
  dialect  : Config.mysql.dialect,
  logging  : false
});

module.exports = {
  mysql : db_instance
};