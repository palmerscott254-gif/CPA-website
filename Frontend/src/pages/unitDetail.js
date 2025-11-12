import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  Download, 
  Calendar, 
  Star,
  HelpCircle,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { fetchJSON, downloadFile } from "../api";
import { logger } from "../utils/logger";

const UnitDetail = () => {
  const { id } = useParams();
  const [unit, setUnit] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);

  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [materialsRef, materialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    // Scroll to top when navigating to a unit detail
    if (typeof window !== 'undefined') window.scrollTo(0, 0);

    // Fetch unit details and materials
    Promise.all([
      fetchJSON(`/subjects/units/`).then(data => {
        // Handle paginated response
        const unitsArray = Array.isArray(data) ? data : (data?.results || []);
        const foundUnit = unitsArray.find(u => u.id === Number(id));
        if (!foundUnit) throw new Error("Unit not found");
        return foundUnit;
      }),
      fetchJSON(`/materials/?unit=${id}`)
    ])
    .then(([unitData, materialsData]) => {
      setUnit(unitData);
      // Handle paginated materials response
      const materialsArray = Array.isArray(materialsData) ? materialsData : (materialsData?.results || []);
      setMaterials(materialsArray);
      setLoading(false);
    })
    .catch(err => {
      logger.error("Error fetching data:", err);
      setError("Failed to load unit details");
      setLoading(false);
    });
  }, [id]);

  const handleDownload = async (material) => {
    setDownloading(material.id);
    try {
      await downloadFile(`/materials/${material.id}/download/`);
    } catch (err) {
      alert("Download failed. Please make sure you're logged in.");
      logger.error("Download error:", err);
    } finally {
      setDownloading(null);
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "mp4":
      case "avi":
        return "🎥";
      case "ppt":
      case "pptx":
        return "📊";
      default:
        return "📁";
    }
  };

  const getFileTypeColor = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "doc":
      case "docx":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "mp4":
      case "avi":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "ppt":
      case "pptx":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading unit details...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !unit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <div className="text-red-500 text-lg mb-4">{error || "Unit not found"}</div>
          <Link to="/units" className="btn-primary">
            Back to Units
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-modern py-4">
          <Link 
            to="/units" 
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Units
          </Link>
        </div>
      </div>

      {/* Unit Header */}
      <section 
        ref={headerRef}
        className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-16"
      >
        <div className="container-modern">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-4 mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {unit.title}
                </h1>
                {unit.code && (
                  <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-lg font-medium">
                    {unit.code}
                  </span>
                )}
              </div>
            </motion.div>

            {unit.description && (
              <motion.p
                variants={itemVariants}
                className="text-xl text-primary-100 leading-relaxed mb-8"
              >
                {unit.description}
              </motion.p>
            )}

            {/* Unit Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{materials.length}</div>
                <div className="text-primary-200 text-sm">Materials</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">2-3</div>
                <div className="text-primary-200 text-sm">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">1.2k</div>
                <div className="text-primary-200 text-sm">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">4.8</div>
                <div className="text-primary-200 text-sm">Rating</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Materials Section */}
      <section 
        ref={materialsRef}
        className="section-padding"
      >
        <div className="container-modern">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={materialsInView ? "visible" : "hidden"}
            className="mb-12"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Study Materials
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300"
            >
              Access comprehensive study materials for this unit. Download PDFs, documents, and other resources to enhance your learning.
            </motion.p>
          </motion.div>

          {materials.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No Materials Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
                Study materials for this unit will be added soon. Check back later for updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/materials" className="btn-primary">
                  Browse All Materials
                </Link>
                <Link to="/units" className="btn-secondary">
                  Explore Other Units
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={materialsInView ? "visible" : "hidden"}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {materials.map((material, index) => (
                <motion.div
                  key={material.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="card-modern p-6 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-accent-500 to-primary-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">{getFileIcon(material.file_type)}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                          {material.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFileTypeColor(material.file_type)}`}>
                          {material.file_type?.toUpperCase() || "FILE"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {material.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                      {material.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        <span>{material.download_count || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(material.upload_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">4.7</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(material)}
                    disabled={downloading === material.id}
                    className="w-full btn-primary py-3 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloading === material.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download Material
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Action Buttons */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-modern">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Continue Your Learning Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Explore more resources and practice your skills with our comprehensive learning tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/materials"
                className="group btn-primary text-lg px-8 py-4 inline-flex items-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                Browse All Materials
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/quizzes"
                className="group btn-secondary text-lg px-8 py-4 inline-flex items-center"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                Practice Quizzes
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/units"
                className="group btn-ghost text-lg px-8 py-4 inline-flex items-center"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Units
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default UnitDetail;