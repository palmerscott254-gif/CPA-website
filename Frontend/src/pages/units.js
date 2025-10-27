import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Search, 
  BookOpen, 
  FileText, 
  Clock, 
  Star, 
  Users,
  Grid,
  List,
  CheckCircle,
  PlayCircle
} from "lucide-react";
import { fetchJSON } from "../api";
import { logger } from "../utils/logger";

const Units = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [viewMode, setViewMode] = useState("grid");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [unitsRef, unitsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    fetchJSON("/subjects/units/")
      .then(data => {
        setUnits(data);
        setLoading(false);
      })
      .catch(err => {
        logger.error("Error fetching units:", err);
        setError("Failed to load units");
        setLoading(false);
      });
  }, []);

  const filteredUnits = units
    .filter(unit => {
      const matchesSearch = unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (unit.description && unit.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDifficulty = filterDifficulty === "all" || 
        (unit.difficulty && unit.difficulty.toLowerCase() === filterDifficulty);
      
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "code":
          return (a.code || "").localeCompare(b.code || "");
        case "difficulty":
          return (a.difficulty || "").localeCompare(b.difficulty || "");
        default:
          return 0;
      }
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading units...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <section 
        ref={headerRef}
        className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-16"
      >
        <div className="container-modern">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              CPA Study Units
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-primary-100 mb-8"
            >
              Comprehensive learning units covering all CPA exam topics. 
              Master each concept with structured content and practice materials.
            </motion.p>
            
            {/* Search and Filters */}
            <motion.div
              variants={itemVariants}
              className="max-w-2xl mx-auto"
            >
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search units..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white/50 focus:outline-none"
                />
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none"
                >
                  <option value="title">Sort by Title</option>
                  <option value="code">Sort by Code</option>
                  <option value="difficulty">Sort by Difficulty</option>
                </select>
                
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none"
                >
                  <option value="all">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                
                <div className="flex bg-white/20 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid" ? "bg-white text-primary-600" : "text-white hover:bg-white/20"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list" ? "bg-white text-primary-600" : "text-white hover:bg-white/20"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Units Section */}
      <section 
        ref={unitsRef}
        className="section-padding"
      >
        <div className="container-modern">
          {filteredUnits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {searchTerm ? "No units found matching your search." : "No units available yet."}
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={unitsInView ? "visible" : "hidden"}
                className={`grid gap-8 ${
                  viewMode === "grid" 
                    ? "md:grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-1"
                }`}
              >
                {filteredUnits.map((unit, index) => (
                  <motion.div
                    key={unit.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`card-modern p-6 group cursor-pointer ${
                      viewMode === "list" ? "flex items-center space-x-6" : ""
                    }`}
                  >
                    {viewMode === "grid" ? (
                      <>
                        {/* Grid View */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {unit.title}
                              </h3>
                              {unit.code && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {unit.code}
                                </span>
                              )}
                            </div>
                          </div>
                          {unit.difficulty && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(unit.difficulty)}`}>
                              {unit.difficulty}
                            </span>
                          )}
                        </div>

                        {unit.description && (
                          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed line-clamp-3">
                            {unit.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>2-3 hours</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              <span>1.2k students</span>
                            </div>
                          </div>
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 text-sm font-medium">4.8</span>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <Link
                            to={`/units/${unit.id}`}
                            className="flex-1 btn-primary text-center py-3 inline-flex items-center justify-center"
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Start Learning
                          </Link>
                          <Link
                            to={`/materials?unit=${unit.id}`}
                            className="btn-secondary py-3 px-4 inline-flex items-center"
                          >
                            <FileText className="w-4 h-4" />
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* List View */}
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                          <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                              {unit.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {unit.code && (
                                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                  {unit.code}
                                </span>
                              )}
                              {unit.difficulty && (
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(unit.difficulty)}`}>
                                  {unit.difficulty}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {unit.description && (
                            <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                              {unit.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>2-3 hours</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                <span>1.2k students</span>
                              </div>
                              <div className="flex items-center text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="ml-1">4.8</span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Link
                                to={`/units/${unit.id}`}
                                className="btn-primary py-2 px-4 inline-flex items-center text-sm"
                              >
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Start
                              </Link>
                              <Link
                                to={`/materials?unit=${unit.id}`}
                                className="btn-secondary py-2 px-4 inline-flex items-center text-sm"
                              >
                                <FileText className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </motion.div>

              {/* Results Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 text-center"
              >
                <div className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    Showing {filteredUnits.length} of {units.length} units
                  </span>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Units;