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

//Update a job
router.put("/:id",authMiddleware, async(req,res)=> {
  try{
    const {title,company,description,location,salary} = req.body;
    const job = await Job.findByPk(req.body.id);

    if(!job){
      return res.status(404).json({error: "Job not found"});
    }
    if(title) job.title = title;
    if(company) job.company = company;
    if(description) job.description = description;
    if(location) job.location = location;
    if(salary!== undefined) job.salary = salary;
    await job.save();
    res.json({
      message: "Job updated successfully",
      job
    });
  } catch(error){
    console.error("Error updating job:",error);
    res.status(500).json({
      error:"Server error",
      details: error.message
    });
  }
});

router.delete("/:id",authMiddleware,async(req,res)=> {
  try{
    console.log("Attempting to delete job with ID:", req.params.id);
    const job = await Job.findByPk(req.params.id);
    console.log("Found job:", job);
    if(!job){
      return res.status(404).json({error:"job id not found"});
    }
    await job.destroy();
    res.json({message:"Job deleted successfully"});
  } catch(error){
    console.error("Error deleting job:",error);
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
});

module.exports = router;