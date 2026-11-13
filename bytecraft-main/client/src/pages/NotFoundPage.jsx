import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, BookOpen, Terminal } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const NotFoundPage = () => {
  return (
    <>
      <SEO
        title="404 — Page Not Found"
        description="The technical page or article you are looking for does not exist on ByteCraft."
      />

      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          {/* Branded Badge */}
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-6 shadow-xs">
            <Terminal className="w-8 h-8 stroke-[2.2]" />
          </div>

          <span className="text-sm font-extrabold text-rose-600 uppercase tracking-widest block mb-2">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Endpoint or Page Not Found
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            The URL you followed does not correspond to an existing route or published article. It may have been migrated, updated, or removed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-rose-600 text-white text-xs font-bold transition-colors inline-flex items-center justify-center gap-2 shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>Back to Homepage</span>
            </Link>

            <Link
              to="/blogs"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors inline-flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse All Articles</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

