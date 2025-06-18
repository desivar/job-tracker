import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const RoleRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user role is allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

export default RoleRoute;
