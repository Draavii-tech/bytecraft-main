import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Terminal, Lock, Mail, ArrowRight, AlertCircle, KeyRound, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/common/SEO';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('admin@bytecraft.io');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (eMail, pwd) => {
    setEmail(eMail);
    setPassword(pwd);
  };

  return (
    <>
      <SEO
        title="Editorial Staff Login — ByteCraft CMS"
        description="Secure authentication portal for ByteCraft editorial team, staff authors, and administrators."
      />

      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xl">
          {/* Logo & Heading */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
                <Terminal className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                Byte<span className="text-rose-600">Craft</span>
              </span>
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Editorial Staff Login</h1>
            <p className="text-xs text-slate-500 mt-1">Enter your credentials to access the Content Management System</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bytecraft.io"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-rose-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Seed Account Demo Helper */}
          <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50/80 -mx-8 -mb-8 p-6 rounded-b-3xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <KeyRound className="w-3.5 h-3.5 text-rose-600" />
              <span>Pre-Seeded Accounts:</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div
                onClick={() => fillQuickCredentials('admin@bytecraft.io', 'Admin@123456')}
                className="p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-rose-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900">Admin: </span>
                  <span className="text-slate-600">admin@bytecraft.io</span>
                </div>
                <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded">
                  Admin@123456
                </span>
              </div>

              <div
                onClick={() => fillQuickCredentials('marcus@bytecraft.io', 'Author@123456')}
                className="p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-rose-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900">Author: </span>
                  <span className="text-slate-600">marcus@bytecraft.io</span>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                  Author@123456
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Click either box to auto-fill credentials.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

