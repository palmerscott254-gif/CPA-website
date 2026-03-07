import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, FileText, Download, Calendar, AlertCircle } from "lucide-react";
import { fetchJSON, downloadFile } from "../api";
import { logger } from "../utils/logger";

const UnitDetail = () => {
  const { id } = useParams();
  const [unit, setUnit] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);

    Promise.all([
      fetchJSON("/subjects/units/").then((data) => {
        const unitsArray = Array.isArray(data) ? data : data?.results || [];
        const foundUnit = unitsArray.find((u) => u.id === Number(id));
        if (!foundUnit) throw new Error("Unit not found");
        return foundUnit;
      }),
      fetchJSON(`/materials/?unit=${id}`),
    ])
      .then(([unitData, materialsData]) => {
        setUnit(unitData);
        const materialsArray = Array.isArray(materialsData) ? materialsData : materialsData?.results || [];
        setMaterials(materialsArray);
      })
      .catch((err) => {
        logger.error("Error fetching unit detail:", err);
        setError("Unable to load unit details right now.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async (material) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setDownloading(material.id);
    try {
      await downloadFile(`/materials/${material.id}/download/`);
    } catch (err) {
      logger.error("Download error:", err);
      if (err?.status === 401) {
        window.location.href = "/login";
      } else if (err?.status === 403) {
        alert("You don't have permission to download this material.");
      } else if (err?.status === 404) {
        alert("Material not found.");
      } else {
        alert(err?.message || "Download failed. Please try again.");
      }
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="page-surface min-h-screen">
        <div className="container-modern section-padding">
          <div className="card-modern text-sm text-slate-600 dark:text-slate-300">Loading unit details...</div>
        </div>
      </div>
    );
  }

  if (error || !unit) {
    return (
      <div className="page-surface min-h-screen">
        <div className="container-modern section-padding">
          <div className="card-modern border-red-200 dark:border-red-800">
            <div className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <span>{error || "Unit not found."}</span>
            </div>
            <Link to="/units" className="btn-primary mt-4">Back to units</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-surface min-h-screen">
      <section className="page-hero">
        <div className="container-modern py-6">
          <Link to="/units" className="inline-flex items-center text-sm font-medium text-primary-700 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to units
          </Link>
        </div>
      </section>

      <section className="section-padding pt-8">
        <div className="container-modern">
          <div className="card-modern mb-6">
            <div className="mb-3 flex items-start gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{unit.title}</h1>
                {unit.code && <p className="mt-1 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{unit.code}</p>}
              </div>
            </div>
            {unit.description && <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{unit.description}</p>}
          </div>

          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Study materials</h2>
            <Link to="/materials" className="btn-ghost">Browse all materials</Link>
          </div>

          {materials.length === 0 ? (
            <div className="card-modern text-sm text-slate-600 dark:text-slate-300">No materials are available for this unit yet.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => (
                <article key={material.id} className="card-modern">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">{material.title}</h3>

                  {material.description && (
                    <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{material.description}</p>
                  )}

                  <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{material.file_type?.toUpperCase() || "FILE"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>{material.download_count || 0} downloads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(material.upload_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(material)}
                    disabled={downloading === material.id}
                    className="btn-primary mt-5 w-full"
                  >
                    {downloading === material.id ? "Downloading..." : "Download material"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UnitDetail;
