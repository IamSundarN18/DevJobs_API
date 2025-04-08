const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const JobBenefit = sequelize.define("JobBenefit", {
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
  benefitId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'benefits',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  tableName: 'job_benefits'
});

module.exports = JobBenefit; 