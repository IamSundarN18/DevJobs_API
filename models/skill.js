const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// Define skill categories and their values
const SKILL_CATEGORIES = {
  'Programming Language': [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go',
    'TypeScript', 'Rust', 'Scala', 'R'
  ],
  'Frontend': [
    'React.js', 'Angular', 'Vue.js', 'Next.js', 'HTML5', 'CSS3', 'SASS', 'Tailwind',
    'Bootstrap', 'Material_UI', 'Redux', 'jQuery'
  ],
  'Backend': [
    'Node.js', 'Express.js', 'Django', 'Spring_Boot', 'Laravel', 'ASP.NET', 'Flask',
    'FastAPI', 'Ruby_on_Rails', 'NestJS'
  ],
  'Database': [
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Oracle', 'SQL_Server', 'Elasticsearch',
    'Cassandra', 'DynamoDB'
  ],
  'Cloud & DevOps': [
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab_CI', 'Terraform',
    'Ansible', 'Linux'
  ],
  'Mobile': [
    'React_Native', 'Flutter', 'iOS', 'Android', 'Xamarin'
  ],
  'AI/ML': [
    'TensorFlow', 'PyTorch', 'Scikit_learn', 'OpenCV', 'NLTK'
  ],
  'Testing': [
    'Jest', 'Mocha', 'Selenium', 'Cypress', 'JUnit'
  ],
  'Other': [
    'Git', 'GraphQL', 'WebSocket', 'REST_API', 'gRPC'
  ]
};

// Flatten the skills array for ENUM
const SKILL_VALUES = Object.values(SKILL_CATEGORIES).flat();

const Skill = sequelize.define("Skill", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.ENUM(SKILL_VALUES),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  category: {
    type: DataTypes.ENUM(Object.keys(SKILL_CATEGORIES)),
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'skills'
});

// Create a mapping of skills to their categories
const skillCategories = {};
Object.entries(SKILL_CATEGORIES).forEach(([category, skills]) => {
  skills.forEach(skill => {
    skillCategories[skill] = category;
  });
});

module.exports = { Skill, skillCategories, SKILL_VALUES, SKILL_CATEGORIES }; 