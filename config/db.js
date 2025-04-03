const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("devjobs","root","mysqlroot",{
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;