import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  MessageSquare
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    // Example: await fetchJSON("/contact/submit/", { method: "POST", body: JSON.stringify(formData) });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Clock,
      title: "Response Time",
      description: "We reply within 24 hours",
      details: "Monday - Sunday, 24/7 Support"
    },
    {
      icon: Mail,
      title: "Email",
      description: "support@cpaacademy.com",
      details: "For general inquiries and support"
    },
    {
      icon: Phone,
      title: "Phone",
      description: "+1 (555) 123-4567",
      details: "Mon-Fri 9AM-5PM EST"
    },
    {
      icon: MapPin,
      title: "Location",
      description: "Online Platform",
      details: "Accessible from anywhere"
    }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="container-modern">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Contact Support
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Have questions or need assistance? We're here to help! Reach out to our support team 
            and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {contactInfo.map((info) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={info.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="card-modern p-6 text-center"
              >
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {info.title}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-1">
                  {info.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {info.details}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Contact Form */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-modern p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <MessageSquare className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Send us a Message
              </h2>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Thank you for contacting us. We'll respond within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="form-label">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="form-input resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary text-lg inline-flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="card-modern p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    How quickly will I receive a response?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    We aim to respond to all inquiries within 24 hours during business days. 
                    For urgent matters, please indicate this in your subject line.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    What type of support do you offer?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    We provide technical support, course content assistance, account help, 
                    and general inquiries about our platform and learning materials.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Can I schedule a call with support?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Yes! Once you submit your inquiry, our team can arrange a call if needed 
                    to better assist with complex issues.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-modern p-8 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Need Immediate Help?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Check out our comprehensive documentation and guides for quick answers 
                to common questions.
              </p>
              <a href="/materials" className="btn-primary inline-block">
                Browse Materials
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


