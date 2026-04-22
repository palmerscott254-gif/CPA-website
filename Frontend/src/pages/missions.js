import React from "react";
import { Link } from "react-router-dom";
import { Target, CheckCircle2, ArrowRight } from "lucide-react";

const values = [
  {
    title: "Clarity",
    description: "Explain CPA concepts in a way that is easy to follow and revise.",
  },
  {
    title: "Consistency",
    description: "Help learners maintain steady study habits with structured resources.",
  },
  {
    title: "Practicality",
    description: "Focus on exam-relevant content and realistic question practice.",
  },
  {
    title: "Accessibility",
    description: "Keep quality prep available to learners with different schedules and budgets.",
  },
];

const priorities = [
  "Organize each CPA section into clear study units.",
  "Keep materials updated with current exam expectations.",
  "Provide quizzes that reinforce understanding, not memorization.",
  "Maintain a fast and reliable platform for daily study.",
  "Support learners with practical guidance throughout preparation.",
];

const Missions = () => {
  return (
    <div className="page-surface min-h-screen">
      <section className="page-hero">
        <div className="container-modern section-padding">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-300">Mission</p>
            <h1 className="section-title mt-2">Why CPA Academy exists</h1>
            <p className="section-subtitle">
              We make CPA preparation clear, practical, and sustainable for real schedules.
              Learn in focused units, revise with materials, and test understanding with quizzes.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/units" className="btn-primary">
                Explore units
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/materials" className="btn-secondary">
                View materials
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-modern">
          <div className="mx-auto max-w-3xl card-modern">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              <Target className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Why we built CPA Academy</h2>
            <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                Most learners are balancing exams with work, family, and limited time. We built this platform to reduce
                confusion and help students focus on what matters for the CPA exams.
              </p>
              <p>
                Our approach is simple: structured units, supporting materials, and targeted quizzes in one place. The
                goal is to make daily progress realistic and measurable.
              </p>
              <p>
                We continue improving content and platform quality based on student feedback and real usage patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-modern">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Core values</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">The principles behind our learning experience.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {values.map((value) => (
              <article key={value.title} className="card-modern">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{value.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-modern">
          <div className="card-modern max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Current priorities</h2>
            <div className="mt-4 space-y-3">
              {priorities.map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Missions;
