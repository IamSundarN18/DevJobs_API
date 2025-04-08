const express = require("express");
const { Job, Skill, Benefit, Requirement } = require("../models/associations");
const { skillCategories } = require("../models/skill");
const { benefitCategories } = require("../models/benefit");
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const validateSkills = (skills) => {
  if (!Array.isArray(skills)) return false;
  return skills.every(skill => Object.keys(skillCategories).includes(skill));
};

const validateBenefits = (benefits) => {
  if (!Array.isArray(benefits)) return false;
  return benefits.every(benefit => Object.keys(benefitCategories).includes(benefit));
};

const parseRequirement = (req) => {
  if (typeof req === 'string') {
    // If it's just a string, treat it as a description with default values
    return {
      description: req,
      type: 'other',
      priority: 'required'
    };
  }
  
  // If it's an object, use the provided values
  return {
    description: req.description,
    type: req.type || 'other',
    priority: req.priority || 'required',
    value: req.value,
    unit: req.unit
  };
};

//Get all jobs with related data
router.get("/", async(req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [
        { 
          model: Skill,
          attributes: ['name', 'category'],
          through: { attributes: [] }
        },
        { 
          model: Benefit,
          attributes: ['name', 'category'],
          through: { attributes: [] }
        },
        { 
          model: Requirement,
          attributes: ['description', 'type', 'priority', 'value', 'unit'],
          through: { attributes: [] }
        }
      ],
      attributes: [
        'id', 'title', 'company', 'location', 'description', 
        'salary', 'experience', 'jobType', 'category', 
        'remote', 'status', 'postedDate'
      ]
    });
    res.json(jobs);
  } catch(error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
});

//Get job by ID with related data
router.get("/:id", async(req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        { 
          model: Skill,
          attributes: ['name', 'category'],
          through: { attributes: [] }
        },
        { 
          model: Benefit,
          attributes: ['name', 'category'],
          through: { attributes: [] }
        },
        { 
          model: Requirement,
          attributes: ['description', 'type', 'priority', 'value', 'unit'],
          through: { attributes: [] }
        }
      ],
      attributes: [
        'id', 'title', 'company', 'location', 'description', 
        'salary', 'experience', 'jobType', 'category', 
        'remote', 'status', 'postedDate'
      ]
    });
    if(!job) {
      return res.status(404).json({error: "Job not found"});
    }
    res.json(job);
  } catch(error){
    console.error("error fetching job:",error);
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
});

//Add a job(Protected)
router.post("/", authMiddleware, async(req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      salary,
      experience,
      jobType,
      category,
      remote,
      skills,
      benefits,
      requirements
    } = req.body;

    // Validate required fields
    if(!title || !company || !location || !description) {
      return res.status(400).json({error: "Title, company, location, and description are required"});
    }

    // Validate skills
    if (skills && !validateSkills(skills)) {
      return res.status(400).json({
        error: "Invalid skills provided. Please use only predefined skills.",
        validSkills: Object.keys(skillCategories)
      });
    }

    // Validate benefits
    if (benefits && !validateBenefits(benefits)) {
      return res.status(400).json({
        error: "Invalid benefits provided. Please use only predefined benefits.",
        validBenefits: Object.keys(benefitCategories)
      });
    }

    const job = await Job.create({
      title,
      company,
      location,
      description,
      salary,
      experience,
      jobType,
      category,
      remote,
      postedDate: new Date()
    });

    // Handle skills
    if (skills && skills.length > 0) {
      const skillInstances = await Promise.all(
        skills.map(skillName => 
          Skill.findOrCreate({ 
            where: { 
              name: skillName,
              category: skillCategories[skillName]
            },
            defaults: {
              name: skillName,
              category: skillCategories[skillName]
            }
          })
        )
      );
      await job.setSkills(skillInstances.map(([skill]) => skill));
    }

    // Handle benefits with categories
    if (benefits && benefits.length > 0) {
      const benefitInstances = await Promise.all(
        benefits.map(benefitName => 
          Benefit.create({
            name: benefitName,
            category: benefitCategories[benefitName]
          })
        )
      );
      await job.setBenefits(benefitInstances);
    }

    // Handle requirements
    if (requirements && requirements.length > 0) {
      const requirementInstances = await Promise.all(
        requirements.map(req => {
          const parsedReq = parseRequirement(req);
          return Requirement.create(parsedReq);
        })
      );
      await job.setRequirements(requirementInstances);
    }

    // Fetch the complete job with all relations
    const completeJob = await Job.findByPk(job.id, {
      include: [
        { 
          model: Skill,
          attributes: ['name', 'category']
        },
        { 
          model: Benefit,
          attributes: ['name', 'category']
        },
        { model: Requirement }
      ]
    });
    
    return res.status(201).json({
      message: "Job Added Successfully!",
      job: completeJob
    });

  } catch(error) {
    console.error("Error creating job:", error);
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
});

//Bulk add jobs(Protected)
router.post("/bulk", authMiddleware, async(req, res) => {
  try {
    const jobs = req.body;
    if(!Array.isArray(jobs)){
      return res.status(400).json({error: "Request must be an array of jobs"});
    }

    const createdJobs = [];
    for(const jobData of jobs) {
      const {
        title,
        company,
        location,
        description,
        salary,
        experience,
        jobType,
        category,
        remote,
        skills,
        benefits,
        requirements
      } = jobData;

      if(!title || !description || !company || !location) {
        return res.status(400).json({
          error: "Each job must have title, description, company and location."
        });
      }

      // Validate skills
      if (skills && !validateSkills(skills)) {
        return res.status(400).json({
          error: "Invalid skills provided. Please use only predefined skills.",
          validSkills: Object.keys(skillCategories)
        });
      }

      // Validate benefits
      if (benefits && !validateBenefits(benefits)) {
        return res.status(400).json({
          error: "Invalid benefits provided. Please use only predefined benefits.",
          validBenefits: Object.keys(benefitCategories)
        });
      }

      // Check for existing job with same title, company, and location
      let job = await Job.findOne({
        where: {
          title,
          company,
          location
        }
      });

      if (!job) {
        // Create the job only if it doesn't exist
        job = await Job.create({
          title,
          company,
          location,
          description,
          salary,
          experience,
          jobType,
          category,
          remote,
          postedDate: new Date()
        });
      }

      // Handle skills with categories
      if (skills && skills.length > 0) {
        const skillInstances = await Promise.all(
          skills.map(skillName => 
            Skill.findOrCreate({ 
              where: { 
                name: skillName,
                category: skillCategories[skillName]
              },
              defaults: {
                name: skillName,
                category: skillCategories[skillName]
              }
            })
          )
        );
        await job.setSkills(skillInstances.map(([skill]) => skill));
      }

      // Handle benefits with categories
      if (benefits && benefits.length > 0) {
        const benefitInstances = await Promise.all(
          benefits.map(benefitName => 
            Benefit.findOrCreate({ 
              where: { 
                name: benefitName,
                category: benefitCategories[benefitName]
              },
              defaults: {
                name: benefitName,
                category: benefitCategories[benefitName]
              }
            })
          )
        );
        await job.setBenefits(benefitInstances.map(([benefit]) => benefit));
      }

      // Handle requirements
      if (requirements && requirements.length > 0) {
        // First remove existing requirements
        await job.setRequirements([]);
        
        const requirementInstances = await Promise.all(
          requirements.map(req => {
            const parsedReq = parseRequirement(req);
            return Requirement.create(parsedReq);
          })
        );
        await job.setRequirements(requirementInstances);
      }

      // Fetch the complete job with all relations but minimal data
      const completeJob = await Job.findByPk(job.id, {
        include: [
          { 
            model: Skill,
            attributes: ['name', 'category'],
            through: { attributes: [] }
          },
          { 
            model: Benefit,
            attributes: ['name', 'category'],
            through: { attributes: [] }
          },
          { 
            model: Requirement,
            attributes: ['description', 'type', 'priority', 'value', 'unit'],
            through: { attributes: [] }
          }
        ],
        attributes: [
          'id', 'title', 'company', 'location', 'description', 
          'salary', 'experience', 'jobType', 'category', 
          'remote', 'status', 'postedDate'
        ]
      });

      createdJobs.push(completeJob);
    }

    res.status(201).json({
      message: `${createdJobs.length} jobs processed successfully!`,
      jobs: createdJobs
    });
  } catch(error){
    console.error("Error in bulk creation: ", error);
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
});

//Update a job
router.put("/:id", authMiddleware, async(req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      salary,
      experience,
      jobType,
      category,
      remote,
      skills,
      benefits,
      requirements
    } = req.body;

    const job = await Job.findByPk(req.params.id);
    if(!job) {
      return res.status(404).json({error: "Job not found"});
    }

    // Update basic job fields
    const updateFields = {
      title,
      company,
      description,
      location,
      salary,
      experience,
      jobType,
      category,
      remote
    };

    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] !== undefined) {
        job[key] = updateFields[key];
      }
    });

    await job.save();

    // Update skills if provided
    if (skills) {
      const skillInstances = await Promise.all(
        skills.map(skillName => 
          Skill.findOrCreate({ where: { name: skillName } })
        )
      );
      await job.setSkills(skillInstances.map(([skill]) => skill));
    }

    // Update benefits if provided
    if (benefits) {
      const benefitInstances = await Promise.all(
        benefits.map(benefitName => 
          Benefit.findOrCreate({ where: { name: benefitName } })
        )
      );
      await job.setBenefits(benefitInstances.map(([benefit]) => benefit));
    }

    // Update requirements if provided
    if (requirements) {
      // First remove existing requirements
      await job.setRequirements([]);
      // Then add new ones
      const requirementInstances = await Promise.all(
        requirements.map(description => 
          Requirement.create({ description })
        )
      );
      await job.setRequirements(requirementInstances);
    }

    // Fetch the updated job with all relations
    const updatedJob = await Job.findByPk(job.id, {
      include: [
        { model: Skill },
        { model: Benefit },
        { model: Requirement }
      ]
    });

    res.json({
      message: "Job updated successfully",
      job: updatedJob
    });
  } catch(error) {
    console.error("Error updating job:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
});

//Delete a job
router.delete("/:id", authMiddleware, async(req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if(!job) {
      return res.status(404).json({error: "Job not found"});
    }

    // Delete associated records in junction tables
    await job.setSkills([]);
    await job.setBenefits([]);
    await job.setRequirements([]);

    // Delete the job
    await job.destroy();

    res.json({message: "Job deleted successfully"});
  } catch(error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
});

module.exports = router;