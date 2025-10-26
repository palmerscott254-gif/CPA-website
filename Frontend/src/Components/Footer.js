import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Clock
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { name: "Home", path: "/" },
      { name: "Units", path: "/units" },
      { name: "Materials", path: "/materials" },
      { name: "Quizzes", path: "/quizzes" },
    ],
    about: [
      { name: "Our Mission", path: "/missions" },
      { name: "Contact Support", path: "/contact" },
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container-modern py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-white">
              <BookOpen className="w-8 h-8 text-primary-500" />
              <span>CPA Academy</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Empowering future CPAs with comprehensive learning resources and expert guidance.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-primary-400 transition-colors duration-300 inline-flex items-center"
                  >
                    <span className="mr-2">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">About</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-primary-400 transition-colors duration-300 inline-flex items-center"
                  >
                    <span className="mr-2">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Support</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">24-Hour Response Time</p>
                  <p className="text-sm text-gray-400">We reply within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Email us at:</p>
                  <a 
                    href="mailto:support@cpaacademy.com"
                    className="text-white hover:text-primary-400 transition-colors duration-300"
                  >
                    support@cpaacademy.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-modern py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} CPA Academy. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-primary-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

