import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Units from "./pages/units";
import UnitDetail from "./pages/unitDetail";
import Materials from "./pages/materials";
import Quizzes from "./pages/quizzes";
import Login from "./pages/login";
import Register from "./pages/register";
import NavBar from "./Components/NavBar";

export default function App() {
  return (
    <Router>
      <NavBar />
      <div style={{ minHeight: "calc(100vh - 80px)", backgroundColor: "#f8f9fa" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/units" element={<Units />} />
          <Route path="/units/:id" element={<UnitDetail />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}
