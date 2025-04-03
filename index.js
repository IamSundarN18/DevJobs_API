const sequelize = require("./config/db");

const User = require("./models/user");
const Job = require("./models/Job");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  try{
    await sequelize.sync({force:true});
    console.log("Tables Created Successfully");
  } catch(error){
    console.error("Table creation failed",error);
  }
})();