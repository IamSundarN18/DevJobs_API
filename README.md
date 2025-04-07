# DevJobs API

A RESTful API for managing job listings, built with Node.js, Express, and MySQL. This API provides endpoints for job posting, searching, and management with JWT-based authentication.

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

## Installation

1. Clone the repository:
```bash
git clone https://github.com/IamSundarN18/DevJobs_API.git
cd DevJobs_API
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=devjobs
JWT_SECRET=your_jwt_secret_key
```

4. Create the database:
```sql
CREATE DATABASE devjobs;
```

5. Start the server:
```bash
npm run dev
```

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

## Request/Response Examples

### Register User
```http
POST /auth/signup
Content-Type: application/json

{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "password123"
}
```

### Create Job
```http
POST /jobs
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
    "title": "Software Developer",
    "company": "Tech Corp",
    "location": "Bangalore",
    "description": "Looking for a skilled developer...",
    "salary": "15-20 LPA"
}
```

### Bulk Create Jobs
```http
POST /jobs/bulk
Authorization: Bearer your_jwt_token
Content-Type: application/json

[
    {
        "title": "Job 1",
        "company": "Company 1",
        "location": "Location 1",
        "description": "Description 1",
        "salary": "Salary 1"
    },
    // ... more jobs
]
```

## Error Handling

The API uses standard HTTP status codes and returns detailed error messages:

- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Example error response:
```json
{
    "error": "Error message",
    "details": "Detailed error description"
}
```

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes for sensitive operations
- Environment variables for sensitive data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Sundar N - [@IamSundarN18](https://github.com/IamSundarN18)

Project Link: [https://github.com/IamSundarN18/DevJobs_API](https://github.com/IamSundarN18/DevJobs_API)
