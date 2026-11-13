import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { TwitterXIcon, LinkedInIcon, GitHubIcon, YouTubeIcon } from '../common/SocialIcons';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-3 group focus:outline-none"
              aria-label="ByteCraft Homepage"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-rose-600/30">
                <Terminal className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-rose-400 transition-colors">
                Byte<span className="text-rose-500">Craft</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              An editorial technology publication delivering deep-dive software engineering architecture, distributed systems blueprints, cloud-native scalability, and artificial intelligence research.
            </p>

            {/* Direct Contact Links */}
            <div className="pt-2 space-y-2.5 text-sm">
              <a
                href="mailto:editorial@bytecraft.io"
                className="flex items-center gap-2.5 text-slate-300 hover:text-rose-400 transition-colors group"
              >
                <Mail className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                <span>editorial@bytecraft.io</span>
              </a>
              <a
                href="tel:+18005550199"
                className="flex items-center gap-2.5 text-slate-300 hover:text-rose-400 transition-colors group"
              >
                <Phone className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                <span>+1 (800) 555-0199</span>
              </a>
              <div className="flex items-center gap-2.5 text-slate-400 text-xs">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>500 Howard Street, San Francisco, CA 94105</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-slate-400 hover:text-white transition-colors">
                  All Articles
                </Link>
              </li>
              <li>
                <Link to="/blogs?sort=popular" className="text-slate-400 hover:text-white transition-colors">
                  Trending Stories
                </Link>
              </li>
              <li>
                <Link to="/blogs?category=software-development" className="text-slate-400 hover:text-white transition-colors">
                  Engineering Deep-Dives
                </Link>
              </li>
              <li>
                <Link to="/blogs?category=artificial-intelligence-machine-learning" className="text-slate-400 hover:text-white transition-colors">
                  AI &amp; Neural Research
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Categories */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Topics
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/blogs?category=software-development"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Software Development
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs?category=artificial-intelligence-machine-learning"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  AI &amp; Machine Learning
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs?category=cybersecurity"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Cybersecurity
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs?category=cloud-computing"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Cloud Computing
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs?category=web-and-mobile-app-development"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Web &amp; Mobile
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  to="/topics"
                  className="text-rose-400 hover:text-rose-300 font-semibold transition-colors inline-flex items-center gap-1 text-xs"
                >
                  <span>Explore all topics</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Editorial & Admin */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Editorial CMS
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/signin" className="text-slate-400 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-slate-400 hover:text-white transition-colors">
                  Create Account (Sign Up)
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-400 hover:text-white transition-colors">
                  Editorial Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/posts/new" className="text-slate-400 hover:text-white transition-colors">
                  Submit Draft
                </Link>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="mt-6">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Follow ByteCraft
              </h5>
              <div className="flex items-center gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-rose-600 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-150"
                  aria-label="Follow ByteCraft on Twitter / X"
                >
                  <TwitterXIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-rose-600 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-150"
                  aria-label="Follow ByteCraft on LinkedIn"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-rose-600 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-150"
                  aria-label="ByteCraft Open Source on GitHub"
                >
                  <GitHubIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-rose-600 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-150"
                  aria-label="ByteCraft Engineering Talks on YouTube"
                >
                  <YouTubeIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Dynamic Copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>&copy; {currentYear} ByteCraft Media Group Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-300">Clean Editorial Layout</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-300">MERN Stack</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-300">Zero Placeholder Content</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
