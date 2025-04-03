const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "default_secret";
//console.log(SECRET_KEY);
//User Sign Up
router.post("/signup",async(req,res) => {
  const {username,email,password} = req.body;
  
  if(!username || !email || !password){
    return res.status(400).json({error: "All fields are required"});
  }

  const hashedPassword = await bcrypt.hash(password,10);
  const user = await User.create({username,email,password: hashedPassword});
  res.status(201).json({message: "User Created Successfully!",user});
});

//User Login
router.post("/login",async(req,res) => {
  const {email, password} = req.body;
  try{

    const user = await User.findOne({where: {email}});
    
    if(!user){
      return res.status(401).json({error: "User not found"});
    }
    const isValidPassword = await bcrypt.compare(password,user.password);
    if(!isValidPassword) return res.status(401).json({error: "Invalid password"});
    
    const token = jwt.sign({userId:user.id}, SECRET_KEY, {expiresIn:"1h"});
    
    res.json({message: "Login Successful",token});
  }catch(error){
    console.error("Login error:",error);
    res.status(500).json({error: "Internal Server Error"});
  }

});

module.exports = router;