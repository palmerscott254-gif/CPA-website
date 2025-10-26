import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Target, 
  Users, 
  TrendingUp, 
  Award,
  BookOpen,
  Lightbulb,
  Heart,
  Globe,
  CheckCircle,
  Sparkles
} from "lucide-react";

const Missions = () => {
  const [missionRef, missionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [valuesRef, valuesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [goalsRef, goalsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const values = [
    {
      icon: BookOpen,
      title: "Educational Excellence",
      description: "We are committed to providing the highest quality learning materials and resources to ensure student success.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Accessibility",
      description: "Making CPA education accessible to everyone, regardless of their background or financial situation.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Continuously improving our platform with cutting-edge technology and modern learning methodologies.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Heart,
      title: "Student-Centered",
      description: "Every decision we make is guided by what's best for our students and their learning journey.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Building a worldwide community of aspiring CPAs who support and learn from each other.",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Maintaining the highest standards in content quality, platform performance, and student support.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const goals = [
    "Provide comprehensive coverage of all CPA exam topics with regularly updated content",
    "Create an engaging and interactive learning experience that adapts to each student's pace",
    "Offer affordable and accessible education to aspiring accountants worldwide",
    "Build a supportive community where students can collaborate and grow together",
    "Leverage technology to make learning more efficient and effective",
    "Maintain a 95%+ student satisfaction rate through continuous improvement",
    "Partner with industry professionals to ensure real-world relevance",
    "Provide 24/7 support to help students overcome challenges quickly"
  ];

  const stats = [
    { number: "10,000+", label: "Students Enrolled" },
    { number: "95%", label: "Pass Rate" },
    { number: "500+", label: "Study Materials" },
    { number: "4.9/5", label: "Average Rating" }
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 dark:bg-accent-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative container-modern">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Our Mission & Vision
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Empowering Future 
              <span className="text-gradient block">Accounting Leaders</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              We're on a mission to democratize CPA education and make professional certification 
              accessible to aspiring accountants worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section 
        ref={missionRef}
        className="section-padding bg-white dark:bg-gray-800"
      >
        <div className="container-modern">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="text-xl font-medium text-gray-900 dark:text-white">
                At CPA Academy, our mission is to democratize CPA education by making high-quality learning 
                resources accessible to every aspiring accountant.
              </p>
              <p>
                We believe that financial knowledge and professional certification should be within reach 
                for all students, regardless of their background, location, or financial situation. Education 
                is a fundamental right, and we're committed to breaking down the barriers that prevent 
                talented individuals from achieving their professional goals.
              </p>
              <p>
                We aim to bridge the gap between traditional learning and modern education technology by 
                providing comprehensive study materials, interactive quizzes, and structured learning paths 
                that adapt to each student's unique pace and learning style. Our platform is designed to 
                support you throughout your entire CPA journey, from foundational concepts to advanced 
                exam preparation.
              </p>
              <p>
                Through continuous innovation and dedication to educational excellence, we strive to empower 
                students with the knowledge, confidence, and skills needed to excel in their CPA examinations 
                and build successful, fulfilling careers in accounting and finance.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="container-modern">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section 
        ref={valuesRef}
        className="section-padding bg-gray-50 dark:bg-gray-900"
      >
        <div className="container-modern">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Our Core Values
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              The principles that guide everything we do and every decision we make
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="card-modern p-8"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${value.color} flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Goals Section */}
      <section 
        ref={goalsRef}
        className="section-padding bg-white dark:bg-gray-800"
      >
        <div className="container-modern">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={goalsInView ? "visible" : "hidden"}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Our Goals & Aims
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                What we're working towards every day to serve our students better
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={goalsInView ? "visible" : "hidden"}
              className="space-y-4"
            >
              {goals.map((goal, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-300"
                >
                  <CheckCircle className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {goal}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600">
        <div className="container-modern text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Us in This Mission
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Be part of a community dedicated to excellence in CPA education. 
              Start your journey with us today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-white text-primary-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center"
              >
                Get Started Free
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Missions;

