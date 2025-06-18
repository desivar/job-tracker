// src/App.js
import React from "react";
import {
  Routes,
  Route,
  Navigate,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout components
import Layout from "./components/Layout";
import RoleRoute from "./components/RoleRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Customers from "./pages/Customers";
import Pipelines from "./pages/Pipelines";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

// Role-based route configurations
const routeConfig = {
  admin: {
    dashboard: true,
    jobs: true,
    customers: true,
    pipelines: true,
    profile: true,
  },
  recruiter: {
    dashboard: true,
    jobs: true,
    pipelines: true,
    profile: true,
  },
  hiring_manager: {
    dashboard: true,
    jobs: true,
    pipelines: true,
    profile: true,
  },
  applicant: {
    dashboard: true,
    jobs: true,
    profile: true,
  },
};

// Create router with future flags
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes */}
      <Route
        element={
          <RoleRoute
            allowedRoles={["admin", "recruiter", "hiring_manager", "applicant"]}
          >
            <Layout />
          </RoleRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard - accessible by all roles */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Jobs - accessible by all roles */}
        <Route path="/jobs" element={<Jobs />} />

        {/* Customers - only accessible by admin */}
        <Route
          path="/customers"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <Customers />
            </RoleRoute>
          }
        />

        {/* Pipelines - accessible by admin, recruiter, and hiring_manager */}
        <Route
          path="/pipelines"
          element={
            <RoleRoute allowedRoles={["admin", "recruiter", "hiring_manager"]}>
              <Pipelines />
            </RoleRoute>
          }
        />

        {/* Profile - accessible by all roles */}
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
    },
  }
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ThemeProvider>
  );
}

export default App;
