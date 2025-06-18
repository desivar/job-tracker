# Job Tracker Backend

A robust backend API for the Job Tracker application built with Node.js, Express, and MongoDB.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Database Structure](#database-structure)
- [Authentication & Authorization](#authentication--authorization)
- [API Documentation](#api-documentation)
- [Setup & Installation](#setup--installation)

## Overview

The Job Tracker backend is a role-based API system designed to support job tracking and customer management operations. It features comprehensive user management, secure authentication, and granular access control.

## Features

- **User Management**

  - Role-based access control (Admin, Manager, Employee)
  - Secure authentication using JWT
  - User profile management
  - Department-based organization

- **Security Features**
  - Password hashing with bcrypt
  - JWT token authentication
  - Role-based permissions
  - Request validation
  - Error handling

## Architecture

### Project Structure

```
backend/
├── config/
│   └── config.js         # Configuration management
├── controllers/
│   ├── auth.js           # Authentication logic
│   ├── users.js          # User management
│   ├── jobs.js           # Job operations
│   ├── customers.js      # Customer management
│   └── pipelines.js      # Pipeline handling
├── middleware/
│   ├── auth.js           # Authentication middleware
│   ├── error.js          # Error handling
│   └── validate.js       # Request validation
├── models/
│   ├── User.js           # User schema
│   ├── Job.js            # Job schema
│   ├── Customer.js       # Customer schema
│   └── Pipeline.js       # Pipeline schema
├── routes/
│   ├── auth.js           # Auth routes
│   ├── users.js          # User routes
│   ├── jobs.js           # Job routes
│   ├── customers.js      # Customer routes
│   └── pipelines.js      # Pipeline routes
├── utils/
│   └── errorResponse.js  # Error utility
└── server.js             # Application entry point
```

### Database Structure

#### User Model

```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'employee'],
    required: true
  },
  department: {
    type: String,
    required: true
  },
  permissions: [{
    type: String,
    enum: [
      'create_job', 'edit_job', 'delete_job', 'view_job',
      'create_customer', 'edit_customer', 'delete_customer', 'view_customer',
      'create_pipeline', 'edit_pipeline', 'delete_pipeline', 'view_pipeline',
      'view_dashboard', 'manage_users'
    ]
  }],
  active: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  lastLoginIP: String
}
```

### Middleware Structure

1. **Authentication Middleware (auth.js)**

```javascript
// Protect routes - Verifies JWT token
protect = async (req, res, next) => {
  // Get token from header
  // Verify token
  // Check if user exists
  // Check if user is active
  // Add user to request
};

// Authorize roles - Checks user permissions
authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user role is allowed
    // Grant or deny access
  };
};
```

2. **Validation Middleware (validate.js)**

```javascript
// Validate request data against schema
validate = (schema) => (req, res, next) => {
  // Validate request body
  // Handle validation errors
  // Continue if valid
};
```

3. **Error Handling (error.js)**

```javascript
// Global error handler
errorHandler = (err, req, res, next) => {
  // Set error status and message
  // Format error response
  // Send appropriate error response
};
```

### Authentication & Authorization

1. **Role-Based Permissions**

```javascript
const rolePermissions = {
  admin: [
    "create_job",
    "edit_job",
    "delete_job",
    "view_job",
    "create_customer",
    "edit_customer",
    "delete_customer",
    "view_customer",
    "create_pipeline",
    "edit_pipeline",
    "delete_pipeline",
    "view_pipeline",
    "view_dashboard",
    "manage_users",
  ],
  manager: [
    "create_job",
    "edit_job",
    "view_job",
    "create_customer",
    "edit_customer",
    "view_customer",
    "create_pipeline",
    "edit_pipeline",
    "view_pipeline",
    "view_dashboard",
  ],
  employee: ["view_job", "view_customer", "view_pipeline", "view_dashboard"],
};
```

2. **JWT Token Structure**

```javascript
{
  id: 'user_id',
  username: 'username',
  email: 'email',
  role: 'role',
  permissions: ['permission1', 'permission2']
}
```

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register
Request:
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "employee",
  "department": "string"
}

POST /api/auth/login
Request:
{
  "email": "string",
  "password": "string"
}

GET /api/auth/me
Headers:
Authorization: Bearer <token>
```

### User Management Endpoints

```
GET /api/users
Headers:
Authorization: Bearer <token>

POST /api/users/create (Admin only)
Headers:
Authorization: Bearer <token>
Request:
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "string",
  "department": "string"
}
```

## Setup & Installation

1. **Prerequisites**

   - Node.js (v14 or higher)
   - MongoDB (v4.4 or higher)
   - npm or yarn

2. **Environment Setup**
   Create a `.env` file:

   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/job-tracker
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```

3. **Installation**

   ```bash
   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

## Security Features

1. **Password Security**

   - Bcrypt hashing
   - Minimum length requirement
   - Complexity requirements
   - Failed login tracking

2. **API Security**

   - JWT authentication
   - Role-based access
   - Request validation
   - Error handling

3. **Data Security**
   - Input sanitization
   - MongoDB injection protection
   - Sensitive data encryption

## Error Handling

The application implements a comprehensive error handling system:

```javascript
// Error Response Format
{
  status: 'error',
  message: 'Error description',
  errors: ['Detailed error messages'],
  stack: 'Error stack trace' (development only)
}
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
