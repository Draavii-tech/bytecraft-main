import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit2, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import { categoriesApi } from '../../api/client';
import { AdminNav } from '../../components/admin/AdminNav';
import { Toast } from '../../components/common/Toast';
import { SEO } from '../../components/common/SEO';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: '', message: '' });

  // Create form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchCategories = () => {
    setLoading(true);
    categoriesApi
      .getAll()
      .then((res) => {
        if (res.success) setCategories(res.data);
      })
      .catch((err) => {
        setToast({ type: 'error', message: 'Failed to load categories.' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const res = await categoriesApi.create({ name: name.trim(), description: description.trim() });
      if (res.success) {
        setName('');
        setDescription('');
        setToast({ type: 'success', message: 'Category created successfully!' });
        fetchCategories();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to create category.' });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditName(cat.name);
    setEditDescription(cat.description || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;

    try {
      const res = await categoriesApi.update(id, {
        name: editName.trim(),
        description: editDescription.trim(),
      });
      if (res.success) {
        setToast({ type: 'success', message: 'Category updated successfully!' });
        cancelEdit();
        fetchCategories();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to update category.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await categoriesApi.delete(id);
      if (res.success) {
        setToast({ type: 'success', message: 'Category deleted successfully.' });
        fetchCategories();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete category.' });
    }
  };

  return (
    <>
      <SEO title="Manage Categories — ByteCraft CMS" />

      <AdminNav
        title="Category &amp; Taxonomy Management"
        subtitle="Organize editorial topics, navigational slugs, and content silos"
      >
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: '', message: '' })}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add Category Form (5 Columns) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-800">
                <Plus className="w-4 h-4 text-rose-600" />
                <span>Add New Category</span>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Distributed Databases"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Editorial Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description for SEO and topic landing page headers..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{submitting ? 'Creating...' : 'Create Category'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Categories List Table (7 Columns) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>All Topics ({categories.length})</span>
                <span>Assigned Articles</span>
              </div>

              <div className="divide-y divide-slate-100">
                {loading ? (
                  <div className="p-8 text-center text-xs text-slate-400">Loading categories...</div>
                ) : categories.length > 0 ? (
                  categories.map((cat) => (
                    <div key={cat._id} className="p-4 hover:bg-slate-50/80 transition-colors">
                      {editingId === cat._id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg"
                          />
                          <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Description"
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdate(cat._id)}
                              className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{cat.name}</h4>
                            <span className="text-[11px] text-slate-400 font-mono block">
                              slug: {cat.slug}
                            </span>
                            {cat.description && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                {cat.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                              {cat.postCount || 0}
                            </span>
                            <button
                              type="button"
                              onClick={() => startEdit(cat)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(cat._id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">No categories found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminNav>
    </>
  );
};

