import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Users,
  Globe,
  LogOut,
  Terminal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminNav = ({ children, title, subtitle, actionButton }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const navItems = [
    { name: 'All Posts', path: '/admin', icon: FileText, end: true },
    { name: 'Write New Post', path: '/admin/posts/new', icon: PlusCircle },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Authors & Team', path: '/admin/authors', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-rose-100 selection:text-rose-900">
      {/* Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold shadow-xs">
                <Terminal className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                ByteCraft <span className="text-rose-500 font-semibold text-xs uppercase px-1.5 py-0.5 bg-rose-950 rounded border border-rose-800 ml-1">CMS</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">View Live Site</span>
            </Link>

            <div className="h-5 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
              )}
              <div className="text-xs hidden md:block text-left">
                <p className="font-bold text-white">{user?.name || 'Administrator'}</p>
                <p className="text-[11px] text-rose-400 capitalize">{user?.role || 'admin'}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600/20 px-3 py-1.5 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sub Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'text-rose-600 bg-rose-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {(title || actionButton) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
            <div>
              {title && <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>}
              {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
            </div>
            {actionButton && <div>{actionButton}</div>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

