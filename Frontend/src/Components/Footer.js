import React from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Mail, 
  Clock
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: "Home", path: "/" },
      { name: "Units", path: "/units" },
      { name: "Materials", path: "/materials" },
      { name: "Quizzes", path: "/quizzes" },
    ],
    company: [
      { name: "Mission", path: "/missions" },
      { name: "Contact", path: "/contact" },
      { name: "Login", path: "/login" },
      { name: "Register", path: "/register" },
    ]
  };

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-black">
      <div className="container-modern py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              <BookOpen className="h-6 w-6 text-primary-600" />
              <span>CPA Academy</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Practical, structured CPA preparation with focused units, materials, and practice quizzes.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-600 transition-colors hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-600 transition-colors hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Support</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">24-hour response</p>
                  <p>Monday to Sunday support</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Mail className="h-4 w-4 text-primary-600" />
                <a href="mailto:support@cpaacademy.com" className="transition-colors hover:text-primary-700 dark:hover:text-primary-300">
                  support@cpaacademy.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700">
        <div className="container-modern py-5">
          <div className="flex flex-col items-start justify-between gap-2 text-sm text-slate-500 dark:text-slate-400 md:flex-row md:items-center">
            <p>
              © {currentYear} CPA Academy. All rights reserved.
            </p>
            <p>Built for focused CPA preparation.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


