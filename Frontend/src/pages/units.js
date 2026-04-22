import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, BookOpen, FileText, PlayCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { fetchJSON } from "../api";
import { logger } from "../utils/logger";

const difficultyClass = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  advanced: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

const Units = () => {
  const location = useLocation();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);

    const params = new URLSearchParams(location.search);
    const subject = params.get("subject");
    let url = "/subjects/units/";
    if (subject) url += `?search=${subject}`;

    fetchJSON(url)
      .then((data) => {
        const unitsArray = Array.isArray(data) ? data : data?.results || [];
        setUnits(unitsArray);
      })
      .catch((err) => {
        logger.error("Error fetching units:", err);
        setError("Unable to load units right now.");
      })
      .finally(() => setLoading(false));
  }, [location.search]);

  const filteredUnits = useMemo(() => {
    return [...units]
      .filter((unit) => {
        const matchesSearch =
          unit.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          unit.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          unit.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDifficulty =
          filterDifficulty === "all" || unit.difficulty?.toLowerCase() === filterDifficulty;

        return matchesSearch && matchesDifficulty;
      })
      .sort((a, b) => {
        if (sortBy === "code") return (a.code || "").localeCompare(b.code || "");
        if (sortBy === "difficulty") return (a.difficulty || "").localeCompare(b.difficulty || "");
        return (a.title || "").localeCompare(b.title || "");
      });
  }, [units, searchTerm, sortBy, filterDifficulty]);

  return (
    <div className="page-surface min-h-screen">
      <section className="page-hero">
        <div className="container-modern section-padding">
          <h1 className="section-title">CPA study units</h1>
          <p className="section-subtitle">Browse all units and continue into detailed materials for each topic.</p>

          <div className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 md:grid-cols-3">
            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Search</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, code, or description"
                  className="form-input form-input-icon-left"
                />
              </div>
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Sort</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-input">
                <option value="title">Title</option>
                <option value="code">Code</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Difficulty</span>
              <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} className="form-input">
                <option value="all">All</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-modern">
          {loading ? (
            <div className="card-modern text-sm text-slate-600 dark:text-slate-300">Loading units...</div>
          ) : error ? (
            <div className="card-modern border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          ) : filteredUnits.length === 0 ? (
            <div className="card-modern text-sm text-slate-600 dark:text-slate-300">
              No units match your current filters.
            </div>
          ) : (
            <>
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Showing {filteredUnits.length} of {units.length} units
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredUnits.map((unit) => (
                  <article key={unit.id} className="card-modern">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{unit.title}</h2>
                        {unit.code && (
                          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {unit.code}
                          </p>
                        )}
                      </div>
                      {unit.difficulty && (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${difficultyClass[unit.difficulty?.toLowerCase()] || "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"}`}
                        >
                          {unit.difficulty}
                        </span>
                      )}
                    </div>

                    {unit.description && (
                      <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {unit.description}
                      </p>
                    )}

                    <div className="mt-auto flex gap-2">
                      <Link to={`/units/${unit.id}`} className="btn-primary flex-1">
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Open Unit
                      </Link>
                      <Link to={`/materials?unit=${unit.id}`} className="btn-secondary">
                        <FileText className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Units;
