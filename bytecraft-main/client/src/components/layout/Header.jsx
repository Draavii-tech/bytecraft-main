import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Terminal, LogIn, LayoutDashboard, LogOut, UserPlus, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { categoriesApi } from '../../api/client';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Close mobile drawer and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
  }, [location.pathname, location.search]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch categories for dropdown
  useEffect(() => {
    let mounted = true;
    categoriesApi
      .getAll()
      .then((res) => {
        if (mounted && res.success) {
          setCategories(res.data);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const handleViewAllTopics = () => {
    setCategoriesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Clickable Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg p-1"
            aria-label="ByteCraft Homepage"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                Byte<span className="text-rose-600">Craft</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-700 font-semibold -mt-1 hidden sm:block">
                Engineering &amp; Insights
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-rose-600 bg-rose-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/blogs"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-rose-600 bg-rose-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`
              }
            >
              All Articles
            </NavLink>

            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCategoriesDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none cursor-pointer ${
                  categoriesDropdownOpen
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
                aria-expanded={categoriesDropdownOpen}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    categoriesDropdownOpen ? 'rotate-180 text-rose-600' : 'text-slate-400'
                  }`}
                />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Explore By Topic
                  </div>
                  <div className="max-h-80 overflow-y-auto py-1">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link
                          key={cat._id}
                          to={`/blogs?category=${cat.slug}`}
                          onClick={() => setCategoriesDropdownOpen(false)}
                          className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-left text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <span className="truncate">{cat.name}</span>
                          {cat.postCount !== undefined && (
                            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full ml-2 shrink-0">
                              {cat.postCount}
                            </span>
                          )}
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-xs text-slate-700">Loading categories...</div>
                    )}
                  </div>
                  <div className="border-t border-slate-100 mt-1 pt-1.5 px-3">
                    <Link
                      to="/topics"
                      onClick={handleViewAllTopics}
                      className="w-full text-left text-xs font-bold text-rose-600 hover:text-rose-700 py-1.5 flex items-center justify-between cursor-pointer group"
                    >
                      <span>View all topics</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right Action Area: Sign In / Sign Up */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-600" />
                  <span>Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/signin"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm hover:shadow transition-all duration-150"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-base font-semibold ${
                isActive ? 'text-rose-600 bg-rose-50' : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/blogs"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-base font-semibold ${
                isActive ? 'text-rose-600 bg-rose-50' : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            All Articles
          </NavLink>

          {/* Mobile Categories Accordion */}
          <div className="border-t border-slate-100 pt-2">
            <div className="flex items-center justify-between px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-700">
              <span>Categories</span>
              <Link
                to="/topics"
                onClick={() => setMobileMenuOpen(false)}
                className="text-rose-600 font-bold hover:underline cursor-pointer"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-1 mt-1 pl-2">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/blogs?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-left text-slate-600 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <span>{cat.name}</span>
                  {cat.postCount !== undefined && (
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      {cat.postCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Auth Buttons: Sign In / Sign Up */}
          <div className="border-t border-slate-100 pt-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-base font-semibold text-white bg-slate-900 hover:bg-slate-800"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-base font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
