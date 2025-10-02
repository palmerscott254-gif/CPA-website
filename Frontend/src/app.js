import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Units from "./pages/units";
import UnitDetail from "./pages/unitDetail";
import NavBar from "./Components/NavBar";

export default function App() {
  return (
    <Router>
      <NavBar />
      <div className="container" style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/units" element={<Units />} />
          <Route path="/units/:id" element={<UnitDetail />} />
        </Routes>
      </div>
    </Router>
  );
}
