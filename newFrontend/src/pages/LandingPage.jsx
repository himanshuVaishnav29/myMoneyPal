import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaDownload,
  FaFilter,
  FaShieldAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdAnalytics, MdCategory } from "react-icons/md";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen text-white bg-[#080312]">
      {/* Header */}
      <header className="relative z-10 px-6 py-2 backdrop-blur-sm bg-white/5 border-b border-white/10 sticky top-0">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo + Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-10 md:w-12 h-auto">
              <img
                src="./myMoneyPalLogo.png"
                alt="MyMoneyPal Logo"
                className="w-full h-auto"
              />
            </div>
            <h1
              className="text-xl sm:text-3xl md:text-4xl font-thin 
               bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
               bg-clip-text text-transparent leading-none tracking-tight"
            >
              My MoneyPal
            </h1>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="/login"
              className="px-5 py-2 text-neutral-200 hover:text-white 
              border border-neutral-600 rounded-xl hover:border-indigo-500 
              transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn px-6 py-2 rounded-xl"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-neutral-200 hover:text-white transition-colors"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          {/* Mobile Dropdown */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 md:hidden bg-[#080312]/95 backdrop-blur-sm border-b border-white/10">
              <div className="flex flex-col p-3 space-y-2">
                <Link
                  to="/login"
                  className="px-5 py-2 text-neutral-200 hover:text-white 
                  border border-neutral-600 rounded-xl hover:border-indigo-500 
                  transition-all duration-300 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn px-6 py-2 rounded-xl text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero */}
      <section className="relative px-6 py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_60%)]"></div>

        <div className="max-w-4xl mx-auto relative animate-fadeIn">
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-thin mb-6 
             bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 
             bg-clip-text text-transparent leading-tight"
          >
            Master Your Finances with Ease
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Track expenses, analyze spending behaviors, and build smarter
            financial habits with a modern dashboard built for simplicity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="btn px-8 py-3 text-lg rounded-xl hover:scale-105 transition-all"
            >
              Get Started Free
            </Link>

            {/* <Link
              to="/login"
              className="px-8 py-3 text-lg border border-neutral-700 rounded-xl 
              hover:border-indigo-500 hover:bg-white/5 transition-all duration-300"
            >
              Sign In
            </Link> */}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-thin text-neutral-100 mb-3">
              Features You’ll Love
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Designed to make personal finance simple, smart, and stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: <FaChartLine className="text-indigo-400" />,
                title: "Expense Tracking",
                desc: "Track, categorize, and monitor expenses effortlessly.",
              },
              {
                icon: <MdAnalytics className="text-purple-400" />,
                title: "Analytics Dashboard",
                desc: "Visualize your spending with insights & charts.",
              },
              {
                icon: <FaDownload className="text-pink-400" />,
                title: "Export Data",
                desc: "Download transactions as Excel and maintain records.",
              },
              {
                icon: <FaFilter className="text-cyan-400" />,
                title: "Smart Filtering",
                desc: "Filter by dates, ranges, categories, and tags.",
              },
              {
                icon: <MdCategory className="text-green-400" />,
                title: "Category Management",
                desc: "Organize with custom categories & personalized tags.",
              },
              {
                icon: <FaShieldAlt className="text-orange-400" />,
                title: "Secure & Private",
                desc: "Encrypted, safe, and privacy-focused financial tracking.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm 
                hover:border-indigo-500 hover:bg-white/10 transition-all 
                duration-300 group shadow-lg hover:shadow-indigo-500/20"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-100 mb-2">{f.title}</h3>
                <p className="text-neutral-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="px-6 py-24 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-thin mb-10 text-neutral-100">
            Why Choose My MoneyPal?
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition duration-300 shadow-lg">
              <h3 className="text-xl text-indigo-400 mb-3 font-semibold">Simple</h3>
              <p className="text-neutral-300">
                Clean UI designed for clarity, so managing money never feels messy.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition duration-300 shadow-lg">
              <h3 className="text-xl text-pink-400 mb-3 font-semibold">Insightful</h3>
              <p className="text-neutral-300">
                Get smart analytics that help you understand spending patterns.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition duration-300 shadow-lg">
              <h3 className="text-xl text-purple-400 mb-3 font-semibold">Secure</h3>
              <p className="text-neutral-300">
                Your financial data is protected with industry-level security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-4xl font-thin mb-4 text-neutral-100">
          Ready To Transform Your Financial Life?
        </h2>
        <p className="text-neutral-400 text-lg mb-8">
          Join thousands using MyMoneyPal to stay in control of their finances.
        </p>

        <Link
          to="/signup"
          className="btn px-10 py-3 text-lg rounded-xl hover:scale-105 transition-transform"
        >
          Start Your Journey
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-white/10 text-center text-neutral-400">
        <div className="text-2xl font-thin text-neutral-200 mb-2">My MoneyPal</div>
        <p className="text-neutral-500 mb-3">
          Master Your Finances: A Modern Money Management Platform
        </p>
        <span className="text-sm text-neutral-600">
          © {new Date().getFullYear()} My MoneyPal. All rights reserved.
        </span>
      </footer>
    </div>
  );
};

export default LandingPage;
