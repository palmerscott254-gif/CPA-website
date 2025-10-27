import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Search, 
  HelpCircle, 
  Clock, 
  Star, 
  Users,
  ArrowRight,
  Grid,
  List,
  CheckCircle,
  PlayCircle,
  Target,
  BookOpen,
  Brain,
  Timer,
  RefreshCw
} from "lucide-react";

const Quizzes = () => {
  const [questionSets, setQuestionSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [viewMode, setViewMode] = useState("grid");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [quizzesRef, quizzesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    // Note: You'll need to create an endpoint to list all question sets
    // For now, we'll show a placeholder with some sample data
    setLoading(false);
    setQuestionSets([
      {
        id: 1,
        title: "Financial Accounting Fundamentals",
        description: "Test your knowledge of basic financial accounting principles and concepts.",
        questions: 25,
        difficulty: "beginner",
        duration: 30,
        attempts: 1250,
        rating: 4.8,
        unit: { title: "Financial Accounting", code: "FA-101" }
      },
      {
        id: 2,
        title: "Auditing Standards & Procedures",
        description: "Comprehensive quiz covering auditing standards, procedures, and best practices.",
        questions: 40,
        difficulty: "intermediate",
        duration: 45,
        attempts: 980,
        rating: 4.6,
        unit: { title: "Auditing", code: "AUD-201" }
      },
      {
        id: 3,
        title: "Taxation Law & Regulations",
        description: "Advanced questions on tax law, regulations, and compliance requirements.",
        questions: 35,
        difficulty: "advanced",
        duration: 50,
        attempts: 750,
        rating: 4.9,
        unit: { title: "Taxation", code: "TAX-301" }
      }
    ]);
  }, []);

  const filteredQuizzes = questionSets
    .filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.unit?.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDifficulty = filterDifficulty === "all" || 
        quiz.difficulty === filterDifficulty;
      
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "difficulty":
          return a.difficulty.localeCompare(b.difficulty);
        case "rating":
          return b.rating - a.rating;
        case "attempts":
          return b.attempts - a.attempts;
        default:
          return 0;
      }
    });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
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

  const tips = [
    {
      icon: BookOpen,
      title: "Study First",
      description: "Review the study materials before attempting quizzes for better results."
    },
    {
      icon: Timer,
      title: "Time Management",
      description: "Practice under timed conditions to simulate the real exam experience."
    },
    {
      icon: RefreshCw,
      title: "Review Mistakes",
      description: "Always review incorrect answers to understand the concepts better."
    },
    {
      icon: Target,
      title: "Set Goals",
      description: "Aim for consistent improvement and track your progress over time."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading quizzes...</p>
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
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16"
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
              Practice Quizzes
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-purple-100 mb-8"
            >
              Test your knowledge with our comprehensive quiz collection. 
              Practice questions cover all CPA exam topics with detailed explanations.
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
                  placeholder="Search quizzes..."
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
                  <option value="difficulty">Sort by Difficulty</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="attempts">Sort by Popularity</option>
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
                      viewMode === "grid" ? "bg-white text-purple-600" : "text-white hover:bg-white/20"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list" ? "bg-white text-purple-600" : "text-white hover:bg-white/20"
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

      {/* Quizzes Section */}
      <section 
        ref={quizzesRef}
        className="section-padding"
      >
        <div className="container-modern">
          {filteredQuizzes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {searchTerm ? "No Quizzes Found" : "No Quizzes Available Yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? "Try adjusting your search terms or filters."
                  : "We're working on adding practice quizzes. Check back soon!"
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/units" className="btn-primary">
                  Browse Units
                </Link>
                <Link to="/materials" className="btn-secondary">
                  Study Materials
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={quizzesInView ? "visible" : "hidden"}
                className={`grid gap-8 ${
                  viewMode === "grid" 
                    ? "md:grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-1"
                }`}
              >
                {filteredQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`card-modern p-6 group ${
                      viewMode === "list" ? "flex items-center space-x-6" : ""
                    }`}
                  >
                    {viewMode === "grid" ? (
                      <>
                        {/* Grid View */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <Brain className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                                {quiz.title}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                                {quiz.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                          {quiz.description}
                        </p>

                        {quiz.unit && (
                          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <BookOpen className="w-4 h-4 mr-2" />
                              <span className="font-medium">{quiz.unit.title}</span>
                              {quiz.unit.code && (
                                <span className="ml-2 text-gray-500 dark:text-gray-400">
                                  ({quiz.unit.code})
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <HelpCircle className="w-4 h-4 mr-1" />
                              <span>{quiz.questions} questions</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{quiz.duration} min</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{quiz.attempts}</span>
                            </div>
                          </div>
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 text-sm font-medium">{quiz.rating}</span>
                          </div>
                        </div>

                        <Link
                          to={`/quizzes/${quiz.id}`}
                          className="w-full btn-primary py-3 inline-flex items-center justify-center group/link"
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start Quiz
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </>
                    ) : (
                      <>
                        {/* List View */}
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                          <Brain className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                              {quiz.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                              {quiz.difficulty}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                            {quiz.description}
                          </p>
                          
                          {quiz.unit && (
                            <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <BookOpen className="w-4 h-4 mr-2" />
                                <span className="font-medium">{quiz.unit.title}</span>
                                {quiz.unit.code && (
                                  <span className="ml-2 text-gray-500 dark:text-gray-400">
                                    ({quiz.unit.code})
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center">
                                <HelpCircle className="w-4 h-4 mr-1" />
                                <span>{quiz.questions} questions</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{quiz.duration} min</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                <span>{quiz.attempts} attempts</span>
                              </div>
                              <div className="flex items-center text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="ml-1">{quiz.rating}</span>
                              </div>
                            </div>
                            
                            <Link
                              to={`/quizzes/${quiz.id}`}
                              className="btn-primary py-2 px-6 inline-flex items-center text-sm group/link"
                            >
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Start Quiz
                              <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
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
                    Showing {filteredQuizzes.length} quizzes
                  </span>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Tips Section */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-modern">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Quiz Tips & Strategies
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Maximize your learning potential with these proven strategies for effective quiz practice.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <motion.div
                  key={tip.title}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {tip.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Quizzes;