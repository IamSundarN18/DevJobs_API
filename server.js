require("dotenv").config();
console.log("Starting server initialization...");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

console.log("Loading dependencies...");

const { sequelize, testConnection } = require("./config/db");
const { Job, Skill, Benefit, Requirement } = require("./models/associations");

console.log("Models loaded successfully");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
console.log("Configuring CORS...");
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging middleware - should be first to log everything
app.use((req, res, next) => {
  console.log('-------------------------');
  console.log(`Incoming ${req.method} request to ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// Essential middleware
console.log("Setting up middleware...");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Body logging - after body parsing middleware
app.use((req, res, next) => {
  if (req.body && Object.keys(req.body).length) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Routes
console.log("Setting up routes...");
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const jobRoutes = require("./routes/job");
app.use("/jobs", jobRoutes);

// Testing API Here
app.get("/", (req, res) => {
  console.log("Root route hit");
  res.send("DevJob API is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({ 
    error: 'Something broke!',
    details: err.message 
  });
});

// 404 handler - should be after all routes
app.use((req, res) => {
  console.log(`404: Route not found - ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: `Cannot ${req.method} ${req.url}`,
    message: 'Route not found'
  });
});

// Start the server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync all models with database
    const shouldResetDb = process.env.RESET_DB === 'true';
    if (shouldResetDb) {
      console.log('Resetting database...');
      await sequelize.sync({ force: true });
      console.log('Database reset complete.');
    } else {
      await sequelize.sync();
      console.log('Database tables synced successfully!');
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log('Database is ready to accept connections');
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

console.log("Initializing server...");
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});


// npm start - Regular start, preserves data
// npm run dev - Development mode with nodemon, preserves data
// npm run dev:reset - Development mode with database reset
// npm run start:reset - Production start with database reset