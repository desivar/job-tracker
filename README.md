# Job Tracker & Customer Management System

## Project Overview

This project is a full-stack web application designed to help businesses manage their job workflows and customer relationships efficiently. It features a robust backend API built with Node.js and Express, connected to a MongoDB database, and a dynamic frontend built with React.

Key functionalities include:

* **User Management:** Create, view, update, and delete user accounts (with future potential for authentication and roles).
* **Customer Management:** Store and organize customer contact information and notes.
* **Job Tracking:** Create and manage jobs, link them to specific customers and customizable pipelines.
* **Pipeline Management:** Define flexible, multi-step workflows (pipelines) to track job progress through different stages (e.g., Qualified, Proposal Sent, Closed Won).
* **API Documentation:** Built-in Swagger UI for easy exploration and testing of API endpoints.

## Technologies Used

### Backend

* **Node.js**: JavaScript runtime environment.
* **Express.js**: Web application framework for Node.js.
* **MongoDB**: NoSQL database for flexible data storage.
* **Mongoose (likely used, though not explicitly provided in controllers)**: ODM for MongoDB and Node.js.
* **`dotenv`**: For managing environment variables.
* **`cors`**: For enabling Cross-Origin Resource Sharing.
* **`swagger-autogen` & `swagger-ui-express`**: For automated API documentation.

### Frontend

* **React**: JavaScript library for building user interfaces.
* **React Router DOM**: For declarative routing in React applications.
* **Axios**: Promise-based HTTP client for making API requests.
* **HTML5 / CSS3**: For structuring and styling the web application.

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

* Node.js (LTS version recommended)
* npm (comes with Node.js) or Yarn
* MongoDB Atlas account or a local MongoDB instance running

### 1. Backend Setup

1. **Clone the Repository:**
       ```bash
    git clone <YOUR_BACKEND_REPO_URL>
    cd <YOUR_BACKEND_REPO_NAME> # e.g., cd job-tracker-backend
        ```
    (Note: You'll replace `<YOUR_BACKEND_REPO_URL>` and `<YOUR_BACKEND_REPO_NAME>` with your actual repository details.)

2. **Install Dependencies:**
        ```bash
    npm install
        # or yarn install
           ```

3. **Environment Variables:**
    Create a `.env` file in the root of your backend directory and add your MongoDB connection URI:
         ```
    MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
           ```
    (Replace `<username>`, `<password>`, `<cluster-url>`, and `<database-name>` with your MongoDB Atlas credentials or local connection string.)

4. **Generate Swagger Documentation:**
    Ensure your `swagger-autogen` script's `endpointsFiles` points to your main backend file (e.g., `./backend/index.js`). Then run the script:
         ```bash
    node swagger.js # Or whatever you named your swagger-autogen config file
          ```

5. **Start the Backend Server:**
           ```bash
    npm start # Or node index.js
          ```
    The backend server will run on `http://localhost:5000`.

6. **Access API Documentation:**
    Once the backend is running, open your browser and navigate to `http://localhost:5000/api-docs` to see the Swagger UI.

### 2. Frontend Setup

     ```bash
    git clone <YOUR_FRONTEND_REPO_URL>
    cd <YOUR_FRONTEND_REPO_NAME> # e.g., cd job-tracker-frontend
    ```
    (Note: You'll replace `<YOUR_FRONTEND_REPO_URL>` and `<YOUR_FRONTEND_REPO_NAME>` with your actual repository details.)

2.  **Install Dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Environment Variables:**
    Create a `.env` file in the root of your frontend directory (`my-job-tracker-frontend/`) and add:
        ```
REACT_APP_BACKEND_URL=http://localhost:5000
     ```
4.  **Start the Frontend Development Server:**
    ```bash
    npm start
    ```
    The React application will typically open in your browser at `http://localhost:5000`.

## Features and Usage

* **Login Page:** Access the application (currently with a mock login; future versions will include full authentication).
* **Dashboard:** Overview of key project metrics.
* **Customers:** View, add, edit, and delete customer details.
* **Jobs (Pipeline Board):** Visualize and manage jobs in a Kanban-style board, moving them through different stages of your defined pipelines.
* **Pipelines:** Define and customize the steps for various job types.
* **Users:** Admin-level management of user accounts.

## Contributing

We welcome contributions! Please feel free to fork the repository, make your changes, and submit a pull request.

### Team Members:

**Backend:**

* Jaden Binettte
* Shared Ordaz Santillan
* Oluwashina Samuel Ibukun
* Desire Vargas

**Frontend:**

* Desire Vargas

## License

[MIT License](LICENSE) (You might want to add a LICENSE file if you haven't already.)
