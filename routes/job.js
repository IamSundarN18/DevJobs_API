const express = require("express");
const Job = require("../models/job");
const authMiddleware = require('../middleware/auth');
const router = express.Router();

//Add a job(Protected)
router.post("/", authMiddleware, async(req, res) => {
  try {
    console.log("POST /jobs route hit");
    const {title, company, location, description, salary} = req.body;

    if(!title || !company || !location || !description || !salary) {
      return res.status(400).json({error: "All fields are required"});
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

module.exports = router;