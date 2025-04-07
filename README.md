# DevJobs_API
Starting off by creating API endpoints and handling them using different routes. A RESTful API for managing job listings, built with Node.js, Express, and MySQL. This API provides endpoints for job posting, searching, and management with JWT-based authentication.

## Features

- 🔐 JWT Authentication
- 📝 CRUD Operations for Jobs
- 🔍 Job Search and Filtering
- 📦 Bulk Job Upload
- 🛡️ Protected Routes
- 📊 MySQL Database Integration
- 🔄 Sequelize ORM
- 🚀 RESTful API Design

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **Security**: bcryptjs
- **Environment**: dotenv

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## API Endpoints

### Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Jobs

- `GET /jobs` - Get all jobs
- `GET /jobs/:id` - Get job by ID
- `POST /jobs` - Create a new job (Protected)
- `POST /jobs/bulk` - Bulk create jobs (Protected)
- `PUT /jobs/:id` - Update a job (Protected)
- `DELETE /jobs/:id` - Delete a job (Protected)

