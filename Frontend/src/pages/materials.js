import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Search, 
  FileText, 
  Download, 
  Calendar, 
  Grid,
  List,
  ArrowDown,
  BookOpen,
  Star,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { fetchJSON, downloadFile } from "../api";
import { logger } from "../utils/logger";

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("downloads");
  const [viewMode, setViewMode] = useState("grid");
  const [filterType, setFilterType] = useState("all");
  const [downloading, setDownloading] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState({}); // { materialId: "success" | "error" | "downloading" }
  const [searchParams] = useSearchParams();
  const unitFilter = searchParams.get("unit");

  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [materialsRef, materialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    let url = "/materials/";
    const params = new URLSearchParams();
    
    if (unitFilter) params.append("unit", unitFilter);
    if (searchTerm) params.append("search", searchTerm);
    if (sortBy) params.append("sort", sortBy);
    
    if (params.toString()) url += "?" + params.toString();

    // Ensure we start at the top when navigating to this view / applying filters
    if (typeof window !== "undefined") window.scrollTo(0, 0);

    fetchJSON(url)
      .then(data => {
        // Handle paginated response - data.results is the array
        const materialsArray = Array.isArray(data) ? data : (data?.results || []);
        setMaterials(materialsArray);
        setLoading(false);
      })
      .catch(err => {
        logger.error("Error fetching materials:", err);
        setError("Failed to load materials");
        setLoading(false);
      });
  }, [unitFilter, searchTerm, sortBy]);

  const handleDownload = async (material) => {
    // Note: We don't check auth here - let the backend decide
    // Public materials work without auth, private require it
    
    setDownloading(material.id);
    setDownloadStatus(prev => ({ ...prev, [material.id]: "downloading" }));
    
    const downloadUrl = `/materials/${material.id}/download/`;
    
    try {
      await downloadFile(downloadUrl);
      setDownloadStatus(prev => ({ ...prev, [material.id]: "success" }));
      logger.info(`Successfully downloaded: ${material.title}`);
    } catch (err) {
      logger.error("Download error:", err);
      
      // Handle different error cases
      if (err?.status === 401) {
        // Unauthorized - redirect to login
        logger.warn("Unauthorized download attempt, redirecting to login");
        alert("Please log in to download this material.");
        window.location.href = "/login";
        return;
      } else if (err?.status === 403) {
        // Forbidden - user doesn't have permission
        alert("You don't have permission to download this material.");
      } else if (err?.status === 404) {
        // Not found
        alert("Material not found or file is missing. Please contact support.");
      } else if (err?.status === 0) {
        // Network error
        alert("Network error. Please check your connection and try again.");
      } else {
        // Generic error
        const message = err?.message || "Download failed. Please try again.";
        alert(message);
      }
      
      setDownloadStatus(prev => ({ ...prev, [material.id]: "error" }));
    } finally {
      setDownloading(null);
      // Clear status after 3 seconds
      setTimeout(() => {
        setDownloadStatus(prev => ({ ...prev, [material.id]: undefined }));
      }, 3000);
    }
  };

  const filteredMaterials = materials.filter(material => {
    if (filterType === "all") return true;
    if (filterType === "pdf") return material.file_type === "pdf";
    if (filterType === "doc") return material.file_type === "doc" || material.file_type === "docx";
    if (filterType === "video") return material.file_type === "mp4" || material.file_type === "avi";
    return true;
  });

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
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading materials...</p>
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
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
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
        className="bg-gradient-to-r from-accent-600 to-primary-600 text-white py-16"
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
              Study Materials
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-accent-100 mb-8"
            >
              Access comprehensive study materials, practice documents, and resources 
              to enhance your CPA learning journey.
            </motion.p>
            
            {unitFilter && (
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Filtered by Unit ID: {unitFilter}
              </motion.div>
            )}
            
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
                  placeholder="Search materials..."
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
                  <option value="downloads">Sort by Downloads</option>
                  <option value="title">Sort by Title</option>
                  <option value="date">Sort by Date</option>
                </select>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="pdf">PDF</option>
                  <option value="doc">Documents</option>
                  <option value="video">Videos</option>
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

      {/* Materials Section */}
      <section 
        ref={materialsRef}
        className="section-padding"
      >
        <div className="container-modern">
          {filteredMaterials.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {searchTerm ? "No materials found matching your search." : "No materials available yet."}
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={materialsInView ? "visible" : "hidden"}
                className={`grid gap-8 ${
                  viewMode === "grid" 
                    ? "md:grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-1"
                }`}
              >
                {filteredMaterials.map((material, index) => (
                  <motion.div
                    key={material.id}
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
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-accent-500 to-primary-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <span className="text-2xl">{getFileIcon(material.file_type)}</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
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

                        {material.unit && (
                          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <BookOpen className="w-4 h-4 mr-2" />
                              <span className="font-medium">{material.unit.title}</span>
                              {material.unit.code && (
                                <span className="ml-2 text-gray-500 dark:text-gray-400">
                                  ({material.unit.code})
                                </span>
                              )}
                            </div>
                          </div>
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
                          {downloadStatus[material.id] === "downloading" ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Downloading...
                            </>
                          ) : downloadStatus[material.id] === "success" ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Download Complete
                            </>
                          ) : downloadStatus[material.id] === "error" ? (
                            <>
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Download Failed
                            </>
                          ) : (
                            <>
                              <ArrowDown className="w-4 h-4 mr-2" />
                              Download Material
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <>
                        {/* List View */}
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-accent-500 to-primary-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                          <span className="text-2xl">{getFileIcon(material.file_type)}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                              {material.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFileTypeColor(material.file_type)}`}>
                              {material.file_type?.toUpperCase() || "FILE"}
                            </span>
                          </div>
                          
                          {material.description && (
                            <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                              {material.description}
                            </p>
                          )}
                          
                          {material.unit && (
                            <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <BookOpen className="w-4 h-4 mr-2" />
                                <span className="font-medium">{material.unit.title}</span>
                                {material.unit.code && (
                                  <span className="ml-2 text-gray-500 dark:text-gray-400">
                                    ({material.unit.code})
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center">
                                <Download className="w-4 h-4 mr-1" />
                                <span>{material.download_count || 0} downloads</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>{new Date(material.upload_date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="ml-1">4.7</span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleDownload(material)}
                              disabled={downloading === material.id}
                              className="btn-primary py-2 px-6 inline-flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {downloadStatus[material.id] === "downloading" ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Downloading...
                                </>
                              ) : downloadStatus[material.id] === "success" ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Download Complete
                                </>
                              ) : downloadStatus[material.id] === "error" ? (
                                <>
                                  <AlertCircle className="w-4 h-4 mr-2" />
                                  Download Failed
                                </>
                              ) : (
                                <>
                                  <ArrowDown className="w-4 h-4 mr-2" />
                                  Download
                                </>
                              )}
                            </button>
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
                    Showing {filteredMaterials.length} materials
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

export default Materials;