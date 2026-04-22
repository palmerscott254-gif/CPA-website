import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, FileText, Download, Calendar, ArrowDown, AlertCircle, CheckCircle2 } from "lucide-react";
import apiClient, { fetchJSON, downloadFile } from "../api";
import { logger } from "../utils/logger";

const typeClass = {
  pdf: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  doc: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  docx: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  mp4: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  avi: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  ppt: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  pptx: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("downloads");
  const [filterType, setFilterType] = useState("all");
  const [downloading, setDownloading] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState({});
  const [searchParams] = useSearchParams();
  const unitFilter = searchParams.get("unit");

  useEffect(() => {
    let url = "/materials/";
    const params = new URLSearchParams();

    if (unitFilter) params.append("unit", unitFilter);
    if (searchTerm) params.append("search", searchTerm);
    if (sortBy) params.append("sort", sortBy);
    if (params.toString()) url += `?${params.toString()}`;

    if (typeof window !== "undefined") window.scrollTo(0, 0);

    fetchJSON(url)
      .then((data) => {
        const materialsArray = Array.isArray(data) ? data : data?.results || [];
        setMaterials(materialsArray);
      })
      .catch((err) => {
        logger.error("Error fetching materials:", err);
        setError("Unable to load materials right now.");
      })
      .finally(() => setLoading(false));
  }, [unitFilter, searchTerm, sortBy]);

  const handleDownload = async (material) => {
    setDownloading(material.id);
    setDownloadStatus((prev) => ({ ...prev, [material.id]: "downloading" }));

    try {
      await downloadFile(`/materials/${material.id}/download/`);
      setDownloadStatus((prev) => ({ ...prev, [material.id]: "success" }));
    } catch (err) {
      logger.error("Download error:", err);

      if (err?.status === 401) {
        alert("Please log in to download this material.");
        window.location.href = "/login";
      } else if (err?.status === 403) {
        alert("You don't have permission to download this material.");
      } else if (err?.status === 404) {
        alert("Material not found or file is missing.");
      } else if (err?.status === 0) {
        alert("Network error. Please check your connection and try again.");
      } else {
        alert(err?.message || "Download failed. Please try again.");
      }

      setDownloadStatus((prev) => ({ ...prev, [material.id]: "error" }));
    } finally {
      setDownloading(null);
      setTimeout(() => {
        setDownloadStatus((prev) => ({ ...prev, [material.id]: undefined }));
      }, 2500);
    }
  };

  const directDownloadHref = (materialId) =>
    `${apiClient.baseURL}/materials/${materialId}/download/?redirect=1`;

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      if (filterType === "all") return true;
      if (filterType === "pdf") return material.file_type === "pdf";
      if (filterType === "doc") return material.file_type === "doc" || material.file_type === "docx";
      if (filterType === "video") return material.file_type === "mp4" || material.file_type === "avi";
      return true;
    });
  }, [materials, filterType]);

  return (
    <div className="page-surface min-h-screen">
      <section className="page-hero">
        <div className="container-modern section-padding">
          <h1 className="section-title">Study materials</h1>
          <p className="section-subtitle">Download resources by topic and keep your revision workflow organized.</p>

          <div className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 md:grid-cols-3">
            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Search</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or keyword"
                  className="form-input pl-11"
                />
              </div>
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Sort</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-input">
                <option value="downloads">Downloads</option>
                <option value="title">Title</option>
                <option value="date">Date</option>
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Type</span>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="form-input">
                <option value="all">All</option>
                <option value="pdf">PDF</option>
                <option value="doc">Document</option>
                <option value="video">Video</option>
              </select>
            </label>

            {unitFilter && (
              <div className="md:col-span-3 rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
                Filtered by unit ID: {unitFilter}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-modern">
          {loading ? (
            <div className="card-modern text-sm text-slate-600 dark:text-slate-300">Loading materials...</div>
          ) : error ? (
            <div className="card-modern border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="card-modern text-sm text-slate-600 dark:text-slate-300">No materials match your current filters.</div>
          ) : (
            <>
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Showing {filteredMaterials.length} materials
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredMaterials.map((material) => {
                  const type = material.file_type?.toLowerCase() || "file";
                  const status = downloadStatus[material.id];

                  return (
                    <article key={material.id} className="card-modern">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">{material.title}</h2>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeClass[type] || "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"}`}>
                          {type.toUpperCase()}
                        </span>
                      </div>

                      {material.description && (
                        <p className="mb-4 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{material.description}</p>
                      )}

                      <div className="mb-5 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                        {material.unit?.title && (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>
                              {material.unit.title}
                              {material.unit.code ? ` (${material.unit.code})` : ""}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          <span>{material.download_count || 0} downloads</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(material.upload_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {material.is_public ? (
                        <a href={directDownloadHref(material.id)} onClick={() => setDownloading(material.id)} className="btn-primary w-full" rel="noopener">
                          <ArrowDown className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      ) : (
                        <button onClick={() => handleDownload(material)} disabled={downloading === material.id} className="btn-primary w-full">
                          {status === "downloading" ? (
                            <>
                              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Downloading...
                            </>
                          ) : status === "success" ? (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Download complete
                            </>
                          ) : status === "error" ? (
                            <>
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Retry download
                            </>
                          ) : (
                            <>
                              <ArrowDown className="mr-2 h-4 w-4" />
                              Download
                            </>
                          )}
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Materials;
