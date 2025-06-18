# Job Tracker Application

A comprehensive job tracking and customer management system built with Node.js, Express, MongoDB, and React.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Database Structure](#database-structure)
- [Authentication & Authorization](#authentication--authorization)
- [API Documentation](#api-documentation)
- [Setup & Installation](#setup--installation)

## Overview

The Job Tracker application is a role-based system designed to help businesses manage jobs, customers, and pipelines efficiently. It features a robust backend API built with Express.js and MongoDB, and a React-based frontend interface.

## Features

- **User Management**

  - Role-based access control (Admin, Manager, Employee)
  - Secure authentication using JWT
  - User profile management
  - Department-based organization

- **Job Management**

  - Create and track jobs
  - Status updates
  - Assignment management
  - History tracking

- **Customer Management**

  - Customer profiles
  - Contact information
  - Interaction history
  - Document management

- **Pipeline Management**

  - Stage tracking
  - Progress monitoring
  - Timeline management

- **Dashboard & Analytics**
  - Performance metrics
  - Status overview
  - Trend analysis

## Architecture

### Backend Structure

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
  username: String,
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: Enum['admin', 'manager', 'employee'],
  department: String,
  permissions: Array,
  active: Boolean,
  lastLogin: Date
}
```

#### Job Model

```javascript
{
  title: String,
  description: String,
  status: String,
  assignedTo: ObjectId (ref: User),
  customer: ObjectId (ref: Customer),
  pipeline: ObjectId (ref: Pipeline),
  startDate: Date,
  dueDate: Date,
  completedDate: Date,
  priority: String,
  tags: Array
}
```

#### Customer Model

```javascript
{
  name: String,
  email: String,
  phone: String,
  address: Object,
  contactPerson: String,
  status: String,
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User)
}
```

#### Pipeline Model

```javascript
{
  name: String,
  stages: Array,
  jobs: Array[ObjectId] (ref: Job),
  createdBy: ObjectId (ref: User),
  status: String
}
```

### Middleware Structure

1. **Authentication Middleware (auth.js)**

   - Token verification
   - User authentication
   - Role-based access control

   ```javascript
   protect: Verifies JWT token and adds user to request
   authorize: Checks user permissions for specific routes
   ```

2. **Validation Middleware (validate.js)**

   - Request data validation
   - Schema validation using Joi

   ```javascript
   validate: Validates request body against defined schemas
   ```

3. **Error Handling Middleware (error.js)**
   - Global error handling
   - Error formatting
   - Development vs Production errors

### Authentication & Authorization

1. **JWT-based Authentication**

   - Token generation on login/registration
   - Token verification for protected routes
   - Refresh token mechanism

2. **Role-Based Access Control**

   ```javascript
   Permissions by Role:
   - Admin: Full system access
   - Manager: Create/Edit access
   - Employee: View-only access
   ```

3. **Permission System**
   ```javascript
   Available Permissions:
   - create_job, edit_job, delete_job, view_job
   - create_customer, edit_customer, delete_customer, view_customer
   - create_pipeline, edit_pipeline, delete_pipeline, view_pipeline
   - view_dashboard, manage_users
   ```

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register    # Register new user
POST /api/auth/login       # User login
GET  /api/auth/me         # Get current user
POST /api/auth/logout     # Logout user
```

### User Endpoints

```
GET    /api/users         # Get all users (Admin)
POST   /api/users/create  # Create user (Admin)
GET    /api/users/:id     # Get user by ID (Admin)
PUT    /api/users/:id     # Update user (Admin)
DELETE /api/users/:id     # Delete user (Admin)
```

### Job Endpoints

```
GET    /api/jobs          # Get all jobs
POST   /api/jobs          # Create job
GET    /api/jobs/:id      # Get job by ID
PUT    /api/jobs/:id      # Update job
DELETE /api/jobs/:id      # Delete job
```

### Customer Endpoints

```
GET    /api/customers     # Get all customers
POST   /api/customers     # Create customer
GET    /api/customers/:id # Get customer by ID
PUT    /api/customers/:id # Update customer
DELETE /api/customers/:id # Delete customer
```

## Setup & Installation

1. **Prerequisites**

   - Node.js (v14 or higher)
   - MongoDB (v4.4 or higher)
   - npm or yarn

2. **Environment Setup**
   Create a `.env` file in the backend directory:

   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/job-tracker
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```

3. **Installation Steps**

   ```bash
   # Clone the repository
   git clone <repository-url>

   # Install backend dependencies
   cd job-tracker/backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install

   # Start the backend server
   cd ../backend
   npm run dev

   # Start the frontend application
   cd ../frontend
   npm start
   ```

## Security Features

1. **Password Security**

   - Bcrypt hashing
   - Minimum password requirements
   - Failed login attempt tracking

2. **API Security**

   - CORS protection
   - Rate limiting
   - Request validation
   - XSS protection

3. **Data Security**
   - Input sanitization
   - MongoDB injection protection
   - Sensitive data encryption

## Error Handling

The application implements a comprehensive error handling system:

1. **Operational Errors**

   - Invalid input
   - Invalid authentication
   - Access denied
   - Resource not found

2. **Programming Errors**

   - Database errors
   - Validation errors
   - Internal server errors

3. **Error Response Format**
   ```javascript
   {
     status: 'error',
     message: 'Error description',
     stack: 'Error stack trace' (development only)
   }
   ```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
