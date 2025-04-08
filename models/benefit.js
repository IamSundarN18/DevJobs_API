const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// Define benefit categories and their values
const BENEFIT_CATEGORIES = {
  'Healthcare': [
    'Health_Insurance', 'Dental_Insurance', 'Vision_Insurance', 'Life_Insurance',
    'Mental_Health_Coverage', 'Disability_Insurance', 'Health_Savings_Account',
    'Wellness_Programs'
  ],
  'Work-Life Balance': [
    'Flexible_Hours', 'Remote_Work', 'Unlimited_PTO', 'Paid_Vacation',
    'Paid_Sick_Leave', 'Paid_Parental_Leave', 'Four_Day_Work_Week',
    'Sabbatical_Leave'
  ],
  'Financial': [
    'Competitive_Salary', '401k_Match', 'Stock_Options', 'Performance_Bonus',
    'Sign_On_Bonus', 'Profit_Sharing', 'Employee_Discounts', 'Student_Loan_Assistance'
  ],
  'Professional Development': [
    'Training_Budget', 'Conference_Budget', 'Education_Reimbursement',
    'Professional_Certifications', 'Career_Coaching', 'Mentorship_Program',
    'Leadership_Development'
  ],
  'Lifestyle': [
    'Gym_Membership', 'Company_Events', 'Free_Meals', 'Transportation_Allowance',
    'Phone_Allowance', 'Internet_Allowance', 'Child_Care_Benefits',
    'Pet_Friendly_Office'
  ]
};

// Flatten the benefits array for ENUM
const BENEFIT_VALUES = Object.values(BENEFIT_CATEGORIES).flat();

const Benefit = sequelize.define("Benefit", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.ENUM(BENEFIT_VALUES),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  category: {
    type: DataTypes.ENUM(Object.keys(BENEFIT_CATEGORIES)),
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'benefits'
});

// Create a mapping of benefits to their categories
const benefitCategories = {};
Object.entries(BENEFIT_CATEGORIES).forEach(([category, benefits]) => {
  benefits.forEach(benefit => {
    benefitCategories[benefit] = category;
  });
});

module.exports = { Benefit, benefitCategories, BENEFIT_VALUES, BENEFIT_CATEGORIES }; 