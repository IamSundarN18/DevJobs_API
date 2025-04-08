const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Requirement = sequelize.define("Requirement", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM(
      'education',      // For educational qualifications
      'experience',     // For work experience requirements
      'technical',      // For technical skills/knowledge
      'certification',  // For required certifications
      'soft_skill',     // For soft skills and personal qualities
      'other'          // For miscellaneous requirements
    ),
    allowNull: false,
    defaultValue: 'other'
  },
  priority: {
    type: DataTypes.ENUM(
      'required',      // Must-have requirements
      'preferred',     // Nice-to-have requirements
      'bonus'         // Additional bonus qualifications
    ),
    allowNull: false,
    defaultValue: 'required'
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Specific value for the requirement (e.g., "5" for years of experience)'
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Unit of measurement (e.g., "years" for experience)'
  }
}, {
  timestamps: true,
  tableName: 'requirements'
});

module.exports = Requirement; 