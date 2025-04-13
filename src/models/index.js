const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user/model")(sequelize, Sequelize.DataTypes);
db.Contact = require("./contact/model")(sequelize, Sequelize.DataTypes);

module.exports = db;
