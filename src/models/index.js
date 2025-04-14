import Sequelize from "sequelize";
import sequelize from "../config/database.js";

import userModel from "./user/model.js";
import contactModel from "./contact/model.js";

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = userModel(sequelize, Sequelize.DataTypes);
db.Contact = contactModel(sequelize, Sequelize.DataTypes);

export default db;
