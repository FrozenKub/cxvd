const Sequelize = require("sequelize");

const sequelize = new Sequelize('postgres://root:@localhost/base');


module.exports = sequelize;

global.sequelize = sequelize;