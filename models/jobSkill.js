const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const JobSkill = sequelize.define("JobSkill", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jobs',
      key: 'id'
    }
  },
  skillId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'skills',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  tableName: 'job_skills'
});

module.exports = JobSkill; 