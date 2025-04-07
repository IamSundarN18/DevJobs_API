const express = require("express");
const Job = require("../models/job");
const authMiddleware = require('../middleware/auth');
const router = express.Router();

//Get all jobs
router.get("/",async(req,res)=> {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch(error){
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
});


//Get job by ID
router.get("/:id",async(req,res) => {
  try{
    const job= await Job.findByPk(req.params.id);
    if(!job){
    return res.status(404).json({error: "job not found"});
    }
    res.json(job);
  } catch(error){
    console.error("error fetching job:",error);
    res.status(500).json({
      error:"Server error",
      details: error.message
    });
  }
})

//Add a job(Protected)
router.post("/", authMiddleware, async(req, res) => {
  try {
    console.log("POST /jobs route hit");
    const {title, company, location, description, salary} = req.body;

    if(!title || !company || !location || !description) {
      return res.status(400).json({error: "Title, company, location, and description are required"});
    }

    const job = await Job.create({
      title,
      company,
      location,
      description,
      salary: salary || null
    });
    
    return res.status(201).json({
      message: "Job Added Successfully!",
      job
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
router.post("/bulk",authMiddleware, async(req,res)=> {
  try {
    const jobs = req.body;
    if(!Array.isArray(jobs)){
      return res.status(400).json({error: "Request must be an array of jobs"});
    }
    for(const job of jobs){
      if(!job.title || !job.description || !job.company || !job.location){
        return res.status(400).json({
          error: "Each job must have title, description,company and location."
        });
      }
    }

    const createdJobs = await Job.bulkCreate(jobs);
    res.status(201).json({
      message: `${createdJobs.length} jobs added successfully!`,
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

module.exports = router;