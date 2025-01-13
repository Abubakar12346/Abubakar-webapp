import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import LoginPage from "./LoginPage";
import ReelsPage from "./ReelsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route to Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route to Reels Page */}
        <Route path="/reels" element={<ReelsPage />} />

        {/* Redirect unknown routes to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
