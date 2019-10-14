const Sequelize = require('sequelize');
const config = require('./config');

const mysql = new Sequelize({
  database : config.mysql.database,
  username : config.mysql.username,
  password : config.mysql.password,
  host     : config.mysql.host,
  dialect  : config.mysql.dialect,
  logging  : false
});

module.exports = {
  mysql
};