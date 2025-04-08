const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("devjobs", "root", "mysqlroot", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log,  // Enable logging to see SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
    timezone: '+05:30' 
  },
  timezone: '+05:30' 
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    console.error('Please check:');
    console.error('1. MySQL server is running');
    console.error('2. Database "devjobs" exists');
    console.error('3. Username "root" and password "mysqlroot" are correct');
    return false;
  }
};

module.exports = { sequelize, testConnection };