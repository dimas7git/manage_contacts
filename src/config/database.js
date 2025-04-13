const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  dialect: "mysql",

});

module.exports = sequelize;
