require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const sequelize = require("./config/db");
const User = require("./models/user");
const Job = require("./models/Job");


const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth");
app.use("/auth",authRoutes);


//Testing API Here
app.get("/",(req,res) => {
  res.send("DevJob API is running!");
});

app.listen(PORT, async () => {
  try {
    await sequelize.sync();
    console.log(`Server running on http://localhost:${PORT}`);
  } catch(error){
    console.error('Database connection error:',error);
  }
});
