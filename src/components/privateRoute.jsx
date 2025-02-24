// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("authToken"); // Check for the JWT token
  return token ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
