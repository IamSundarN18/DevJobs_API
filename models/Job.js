const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Job = sequelize.define("Job", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Not specified"
  },
  jobType: {
    type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'),
    allowNull: false,
    defaultValue: 'Full-time'
  },
  category: {
    type: DataTypes.ENUM('Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile', 'Data Science', 'AI/ML', 'QA', 'UI/UX', 'Other'),
    allowNull: false,
    defaultValue: 'Other'
  },
  postedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  remote: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('Active', 'Closed', 'Draft'),
    allowNull: false,
    defaultValue: 'Active'
  }
}, {
  timestamps: true,
  tableName: 'jobs'
});

module.exports = Job;