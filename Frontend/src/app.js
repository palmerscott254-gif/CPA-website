import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import ErrorBoundary from "./Components/ErrorBoundary";

const Home = lazy(() => import("./pages/home"));
const Units = lazy(() => import("./pages/units"));
const UnitDetail = lazy(() => import("./pages/unitDetail"));
const Materials = lazy(() => import("./pages/materials"));
const Quizzes = lazy(() => import("./pages/quizzes"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Contact = lazy(() => import("./pages/contact"));
const Missions = lazy(() => import("./pages/missions"));
const GoogleCallback = lazy(() => import("./pages/GoogleCallback"));

const PageLoading = () => (
  <div className="container-modern py-16">
    <div className="card-modern mx-auto max-w-md text-center">
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
      <p className="text-sm text-slate-600 dark:text-slate-300">Loading page...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Helmet>
          <title>CPA Academy - Master CPA Concepts</title>
          <meta name="description" content="Master Certified Public Accountant concepts with our comprehensive learning platform. Access study materials, practice quizzes, and track your progress." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#3b82f6" />
        </Helmet>
        
        <div className="page-surface min-h-screen">
          <NavBar />
        
        <main className="pt-16 lg:pt-20">
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/units" element={<Units />} />
              <Route path="/units/:id" element={<UnitDetail />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/google-callback" element={<GoogleCallback />} />
            </Routes>
          </Suspense>
        </main>
        
        <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}
