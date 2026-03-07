import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, HelpCircle, Clock, Users, Target, CheckCircle2, AlertCircle } from "lucide-react";

const sampleQuestionSets = [
  {
    id: 1,
    title: "Financial Accounting Fundamentals",
    description: "Core concepts for financial reporting and analysis.",
    questions: 25,
    difficulty: "beginner",
    duration: 30,
    attempts: 1250,
    unit: { title: "Financial Accounting", code: "FA-101" },
  },
  {
    id: 2,
    title: "Auditing Standards & Procedures",
    description: "Practice standards, evidence evaluation, and audit procedures.",
    questions: 40,
    difficulty: "intermediate",
    duration: 45,
    attempts: 980,
    unit: { title: "Auditing", code: "AUD-201" },
  },
  {
    id: 3,
    title: "Taxation Law & Regulations",
    description: "Advanced tax compliance and regulatory practice questions.",
    questions: 35,
    difficulty: "advanced",
    duration: 50,
    attempts: 750,
    unit: { title: "Taxation", code: "TAX-301" },
  },
];

const difficultyClass = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  advanced: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

const Quizzes = () => {
  const [questionSets, setQuestionSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  useEffect(() => {
    setQuestionSets(sampleQuestionSets);
    setLoading(false);
  }, []);

  const filteredQuizzes = useMemo(() => {
    return [...questionSets]
      .filter((quiz) => {
        const matchesSearch =
          quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.unit?.title.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDifficulty = filterDifficulty === "all" || quiz.difficulty === filterDifficulty;

        return matchesSearch && matchesDifficulty;
      })
      .sort((a, b) => {
        if (sortBy === "difficulty") return a.difficulty.localeCompare(b.difficulty);
        if (sortBy === "duration") return a.duration - b.duration;
        if (sortBy === "questions") return b.questions - a.questions;
        return a.title.localeCompare(b.title);
      });
  }, [questionSets, searchTerm, sortBy, filterDifficulty]);

  return (
    <div className="page-surface min-h-screen">
      <section className="page-hero">
        <div className="container-modern section-padding">
          <h1 className="section-title">Practice quizzes</h1>
          <p className="section-subtitle">Assess your understanding with topic-based practice sets and timed sessions.</p>

          <div className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 md:grid-cols-3">
            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Search</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by quiz title or unit"
                  className="form-input pl-9"
                />
              </div>
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Sort</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-input">
                <option value="title">Title</option>
                <option value="difficulty">Difficulty</option>
                <option value="duration">Duration</option>
                <option value="questions">Questions</option>
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
            <div className="card-modern text-sm text-slate-600 dark:text-slate-300">Loading quizzes...</div>
          ) : error ? (
            <div className="card-modern border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="card-modern text-sm text-slate-600 dark:text-slate-300">No quizzes match your current filters.</div>
          ) : (
            <>
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Showing {filteredQuizzes.length} quizzes
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredQuizzes.map((quiz) => (
                  <article key={quiz.id} className="card-modern">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{quiz.title}</h2>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${difficultyClass[quiz.difficulty]}`}>
                        {quiz.difficulty}
                      </span>
                    </div>

                    <p className="mb-4 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{quiz.description}</p>

                    <div className="mb-5 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <span>{quiz.questions} questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{quiz.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{quiz.attempts} attempts</span>
                      </div>
                      {quiz.unit?.title && (
                        <div className="flex items-center gap-2">
                          <HelpCircle className="h-4 w-4" />
                          <span>
                            {quiz.unit.title}
                            {quiz.unit.code ? ` (${quiz.unit.code})` : ""}
                          </span>
                        </div>
                      )}
                    </div>

                    <button className="btn-secondary w-full" disabled>
                      Quiz interface coming soon
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}

          <div className="mt-8 card-modern">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Need revision resources before attempting quizzes? Visit <Link className="font-semibold text-primary-700 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200" to="/materials">Materials</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Quizzes;
