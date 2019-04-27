const Sequelize = require('sequelize');
const Config = require('./config');

let _db_instance = new Sequelize({
  database : Config.mysql.database,
  username : Config.mysql.username,
  password : Config.mysql.password,
  host     : Config.mysql.host,
  dialect  : Config.mysql.dialect,
});

module.exports = {
  mysql : _db_instance
};