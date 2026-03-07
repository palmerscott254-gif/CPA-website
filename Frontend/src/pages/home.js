import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, FileText, HelpCircle, ArrowRight, AlertCircle } from "lucide-react";
import { fetchJSON } from "../api";
import { logger } from "../utils/logger";

const features = [
  {
    icon: BookOpen,
    title: "Structured Units",
    description: "Learn core CPA concepts in clear, progressive units.",
  },
  {
    icon: FileText,
    title: "Study Materials",
    description: "Access downloadable notes and revision resources by unit.",
  },
  {
    icon: HelpCircle,
    title: "Practice Quizzes",
    description: "Reinforce understanding with topic-based practice quizzes.",
  },
];

const Home = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJSON("/subjects/")
      .then((data) => {
        const subjectsArray = Array.isArray(data) ? data : data?.results || [];
        setSubjects(subjectsArray);
      })
      .catch((err) => {
        logger.error("Error fetching subjects:", err);
        setError("Unable to load subjects right now.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-surface min-h-screen">
      <section className="page-hero">
        <div className="container-modern section-padding">
          <div className="max-w-3xl">
            <h1 className="section-title">Professional CPA preparation, built for focus.</h1>
            <p className="section-subtitle">
              CPA Academy helps you learn with a clear structure: study units, supporting materials, and quizzes in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/units" className="btn-primary">
                Explore Units
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/materials" className="btn-secondary">
                Browse Materials
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-modern">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">What you can do</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card-modern">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-modern">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Available subjects</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Start with a subject and continue into its units.
              </p>
            </div>
            <Link to="/units" className="btn-ghost">View all units</Link>
          </div>

          {loading ? (
            <div className="card-modern text-sm text-slate-600 dark:text-slate-300">Loading subjects...</div>
          ) : error ? (
            <div className="card-modern border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          ) : subjects.length === 0 ? (
            <div className="card-modern text-sm text-slate-600 dark:text-slate-300">No subjects available yet.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <div key={subject.id} className="card-modern">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{subject.name}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Explore units and resources for {subject.name.toLowerCase()}.
                  </p>
                  <Link
                    to={`/units?subject=${subject.slug}`}
                    className="mt-4 inline-flex items-center text-sm font-semibold text-primary-700 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200"
                  >
                    View units
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
