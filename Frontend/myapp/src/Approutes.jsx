import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />          {/* Landing Page */}
        <Route path="/chat" element={<Home />} />          {/* Chat App Page */}
        <Route path="/login" element={<Login />} />        {/* Login Page */}
        <Route path="/register" element={<Register />} />   {/* Register Page */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
