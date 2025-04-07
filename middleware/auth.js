const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  try {
    // Log incoming request
    console.log("Auth Middleware - Processing request");
    console.log("Headers:", req.headers);

    const authHeader = req.header("Authorization");
    console.log("Auth Header:", authHeader);

    if (!authHeader) {
      console.log("No Authorization header");
      return res.status(401).json({ error: "No Authorization header" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("Invalid Authorization format");
      return res.status(401).json({ error: "Invalid Authorization format" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token extracted:", token ? "Present" : "Missing");

    if (!token) {
      console.log("No token found");
      return res.status(401).json({ error: "No token found" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token verified successfully");
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({
        error: "Invalid token",
        details: error.message
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      error: "Authentication error",
      details: error.message
    });
  }
};

module.exports = authMiddleware;