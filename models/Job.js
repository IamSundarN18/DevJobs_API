const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Job = sequelize.define("Job", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey:true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false, 
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Job;