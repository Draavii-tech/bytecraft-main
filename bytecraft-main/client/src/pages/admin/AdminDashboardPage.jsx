import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  CheckCircle,
  Calendar,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { postsApi, categoriesApi } from '../../api/client';
import { AdminNav } from '../../components/admin/AdminNav';
import { Toast } from '../../components/common/Toast';
import { SEO } from '../../components/common/SEO';

export const AdminDashboardPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: '', message: '' });

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchDashboardData = () => {
    setLoading(true);
    const params = {};
    if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
    if (categoryFilter && categoryFilter !== 'all') params.category = categoryFilter;
    if (searchQuery.trim()) params.search = searchQuery.trim();

    Promise.all([postsApi.getAdminPosts(params), categoriesApi.getAll()])
      .then(([postsRes, catRes]) => {
        if (postsRes && postsRes.success) setPosts(postsRes.data);
        if (catRes && catRes.success) setCategories(catRes.data);
      })
      .catch((err) => {
        console.error('fetchDashboardData error:', err);
        const msg =
          err.status === 401
            ? 'Authentication session expired. Please sign in again.'
            : err.message || 'Failed to load posts from server.';
        setToast({ type: 'error', message: msg });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, [statusFilter, categoryFilter, searchQuery]);

  const handleToggleFeatured = async (id) => {
    try {
      const res = await postsApi.toggleFeatured(id);
      if (res.success) {
        setPosts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, isFeatured: res.data.isFeatured } : p))
        );
        setToast({ type: 'success', message: res.message });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to update featured flag' });
    }
  };

  const handleDeletePost = async (id) => {
    try {
      const res = await postsApi.deletePost(id);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
        setToast({ type: 'success', message: 'Article deleted successfully.' });
        setDeleteConfirmId(null);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete post' });
    }
  };

  // Stats calculation
  const totalPosts = posts.length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <>
      <SEO title="Editorial Dashboard — ByteCraft CMS" />

      <AdminNav
        title="Content Management &amp; Articles"
        subtitle="Manage publications, drafts, scheduled deployments, and editorial metrics"
        actionButton={
          <Link
            to="/admin/posts/new"
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Article</span>
          </Link>
        }
      >
        {/* Toast Alert */}
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: '', message: '' })}
        />

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Total Articles
            </span>
            <span className="text-2xl font-black text-slate-900">{totalPosts}</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
              Published
            </span>
            <span className="text-2xl font-black text-emerald-600">{publishedCount}</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
              Drafts
            </span>
            <span className="text-2xl font-black text-amber-600">{draftCount}</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
              Scheduled
            </span>
            <span className="text-2xl font-black text-blue-600">{scheduledCount}</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs col-span-2 lg:col-span-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block mb-1">
              Total Views
            </span>
            <span className="text-2xl font-black text-slate-900">{totalViews.toLocaleString()}</span>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="scheduled">Scheduled</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Views</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      Loading articles...
                    </td>
                  </tr>
                ) : posts.length > 0 ? (
                  posts.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Title & Thumbnail */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.coverImage}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-100"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">{p.title}</p>
                            <span className="text-[10px] text-slate-400 font-mono block truncate">
                              /{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {p.category?.name || 'Unassigned'}
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {p.author?.name || 'Staff'}
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p._id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            p.isFeatured
                              ? 'text-amber-500 hover:bg-amber-50'
                              : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                          }`}
                          title={p.isFeatured ? 'Featured on Homepage' : 'Not Featured'}
                        >
                          <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                            p.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : p.status === 'scheduled'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-700">
                        {p.views?.toLocaleString() || 0}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {p.status === 'published' && (
                            <Link
                              to={`/blog/${p.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="View Live Article"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                          <Link
                            to={`/admin/posts/edit/${p._id}`}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Edit Article"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(p._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      No articles found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete this article?</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                This action cannot be undone. The article and its associated comments/views will be permanently removed.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePost(deleteConfirmId)}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminNav>
    </>
  );
};

