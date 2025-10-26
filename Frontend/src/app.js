import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Home from "./pages/home";
import Units from "./pages/units";
import UnitDetail from "./pages/unitDetail";
import Materials from "./pages/materials";
import Quizzes from "./pages/quizzes";
import Login from "./pages/login";
import Register from "./pages/register";
import Contact from "./pages/contact";
import Missions from "./pages/missions";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

export default function App() {
  return (
    <Router>
      <Helmet>
        <title>CPA Academy - Master CPA Concepts</title>
        <meta name="description" content="Master Certified Public Accountant concepts with our comprehensive learning platform. Access study materials, practice quizzes, and track your progress." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <NavBar />
        
        <main className="pt-16 lg:pt-20">
          <Routes>
            <Route 
              path="/" 
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              } 
            />
            <Route 
              path="/units" 
              element={
                <PageWrapper>
                  <Units />
                </PageWrapper>
              } 
            />
            <Route 
              path="/units/:id" 
              element={
                <PageWrapper>
                  <UnitDetail />
                </PageWrapper>
              } 
            />
            <Route 
              path="/materials" 
              element={
                <PageWrapper>
                  <Materials />
                </PageWrapper>
              } 
            />
            <Route 
              path="/quizzes" 
              element={
                <PageWrapper>
                  <Quizzes />
                </PageWrapper>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PageWrapper>
                  <Login />
                </PageWrapper>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PageWrapper>
                  <Register />
                </PageWrapper>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <PageWrapper>
                  <Contact />
                </PageWrapper>
              } 
            />
            <Route 
              path="/missions" 
              element={
                <PageWrapper>
                  <Missions />
                </PageWrapper>
              } 
            />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}
