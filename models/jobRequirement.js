const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const JobRequirement = sequelize.define("JobRequirement", {
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
  requirementId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'requirements',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  tableName: 'job_requirements'
});

module.exports = JobRequirement; 