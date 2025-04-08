const Job = require('./job');
const { Skill } = require('./skill');
const { Benefit } = require('./benefit');
const Requirement = require('./requirement');
const JobSkill = require('./jobSkill');
const JobBenefit = require('./jobBenefit');
const JobRequirement = require('./jobRequirement');

// Job - Skill (Many-to-Many)
Job.belongsToMany(Skill, { 
  through: JobSkill,
  foreignKey: 'jobId',
  otherKey: 'skillId'
});
Skill.belongsToMany(Job, { 
  through: JobSkill,
  foreignKey: 'skillId',
  otherKey: 'jobId'
});

// Job - Benefit (Many-to-Many)
Job.belongsToMany(Benefit, { 
  through: JobBenefit,
  foreignKey: 'jobId',
  otherKey: 'benefitId'
});
Benefit.belongsToMany(Job, { 
  through: JobBenefit,
  foreignKey: 'benefitId',
  otherKey: 'jobId'
});

// Job - Requirement (Many-to-Many)
Job.belongsToMany(Requirement, { 
  through: JobRequirement,
  foreignKey: 'jobId',
  otherKey: 'requirementId'
});
Requirement.belongsToMany(Job, { 
  through: JobRequirement,
  foreignKey: 'requirementId',
  otherKey: 'jobId'
});

module.exports = {
  Job,
  Skill,
  Benefit,
  Requirement,
  JobSkill,
  JobBenefit,
  JobRequirement
}; 