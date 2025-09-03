import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />          {/* Home Page */}
        <Route path="/login" element={<Login />} />    {/* Login Page */}
        <Route path="/register" element={<Register />} /> {/* Register Page */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
