import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Upload,
  Globe,
  Settings,
  Calendar,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Eye,
  Clock,
  Sparkles,
} from 'lucide-react';
import { postsApi, categoriesApi, usersApi, uploadApi } from '../../api/client';
import { AdminNav } from '../../components/admin/AdminNav';
import { RichEditor } from '../../components/admin/RichEditor';
import { Toast } from '../../components/common/Toast';
import { SEO } from '../../components/common/SEO';

export const AdminPostEditorPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState('published');
  const [publishAt, setPublishAt] = useState('');

  // SEO fields
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [toast, setToast] = useState({ type: '', message: '' });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load Categories & Authors
  useEffect(() => {
    Promise.all([categoriesApi.getAll(), usersApi.getAll()]).then(([catRes, userRes]) => {
      if (catRes.success) {
        setCategories(catRes.data);
        if (!category && catRes.data.length > 0) {
          setCategory(catRes.data[0]._id);
        }
      }
      if (userRes.success) {
        setAuthors(userRes.data);
        if (!author && userRes.data.length > 0) {
          setAuthor(userRes.data[0]._id);
        }
      }
    });
  }, []);

  // Load existing post if editing
  useEffect(() => {
    if (isEditing) {
      setInitialLoading(true);
      postsApi
        .getPostById(id)
        .then((res) => {
          if (res.success && res.data) {
            const p = res.data;
            setTitle(p.title || '');
            setSlug(p.slug || '');
            setExcerpt(p.excerpt || '');
            setContent(p.content || '');
            setCoverImage(p.coverImage || '');
            setCategory(p.category?._id || p.category || '');
            setTags(Array.isArray(p.tags) ? p.tags.join(', ') : '');
            setAuthor(p.author?._id || p.author || '');
            setIsFeatured(Boolean(p.isFeatured));
            setStatus(p.status || 'published');
            if (p.publishAt) {
              const dt = new Date(p.publishAt);
              setPublishAt(dt.toISOString().slice(0, 16));
            }
            setSeoTitle(p.seoTitle || '');
            setMetaDescription(p.metaDescription || '');
          }
        })
        .catch((err) => {
          setToast({ type: 'error', message: 'Failed to load post for editing' });
        })
        .finally(() => {
          setInitialLoading(false);
        });
    }
  }, [id, isEditing]);

  // Handle Cover Image Upload with automatic WebP compression
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadApi.uploadImage(file);
      if (res.success && res.url) {
        setCoverImage(res.url);
        setToast({ type: 'success', message: 'Image compressed & converted to WebP successfully!' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Image upload failed' });
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSave = async (targetStatus) => {
    if (!title.trim()) {
      setToast({ type: 'error', message: 'Please provide an article title.' });
      return;
    }
    if (!excerpt.trim()) {
      setToast({ type: 'error', message: 'Please provide a short excerpt description.' });
      return;
    }
    if (!content.trim()) {
      setToast({ type: 'error', message: 'Please provide article content.' });
      return;
    }
    if (!coverImage.trim()) {
      setToast({ type: 'error', message: 'Please provide or upload a cover image.' });
      return;
    }
    if (!category) {
      setToast({ type: 'error', message: 'Please select a category.' });
      return;
    }

    setLoading(true);
    const postPayload = {
      title,
      slug: slug.trim() || undefined,
      excerpt,
      content,
      coverImage,
      category,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      author: author || undefined,
      isFeatured,
      status: targetStatus || status,
      publishAt: targetStatus === 'scheduled' || status === 'scheduled' ? publishAt || new Date() : new Date(),
      seoTitle: seoTitle.trim() || title,
      metaDescription: metaDescription.trim() || excerpt.substring(0, 160),
    };

    try {
      if (isEditing) {
        const res = await postsApi.updatePost(id, postPayload);
        setToast({ type: 'success', message: res.message || 'Article updated successfully!' });
      } else {
        const res = await postsApi.createPost(postPayload);
        setToast({ type: 'success', message: res.message || 'Article created successfully!' });
        setTimeout(() => {
          navigate('/admin');
        }, 1200);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to save article.' });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <AdminNav title="Loading Article...">
        <div className="py-20 text-center text-slate-400">Loading article editor data...</div>
      </AdminNav>
    );
  }

  return (
    <>
      <SEO title={isEditing ? `Edit: ${title}` : 'Write New Article — ByteCraft CMS'} />

      <AdminNav
        title={isEditing ? 'Edit Technical Article' : 'Write New Article'}
        subtitle="Craft comprehensive engineering insights, code snippets, and system diagrams"
        actionButton={
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>

            <button
              type="button"
              onClick={() => handleSave(status)}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : isEditing ? 'Update Article' : 'Publish / Save'}</span>
            </button>
          </div>
        }
      >
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: '', message: '' })}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title Input */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Sagas and Eventual Consistency in High-Throughput Microservices"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Excerpt / Short Summary *
                </label>
                <textarea
                  required
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Provide a concise 2–3 sentence technical summary displayed on post cards and search feeds..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all leading-relaxed"
                />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Article Body Content (Rich HTML &amp; Code Blocks) *
              </label>
              <RichEditor
                value={content}
                onChange={setContent}
                placeholder="Start writing your article... Use Headings (H2/H3) for the Table of Contents, code blocks for syntax, and comparison tables."
              />
            </div>

            {/* SEO & Metadata Panel */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-800">
                <Globe className="w-4 h-4 text-rose-600" />
                <span>Search Engine Optimization (SEO) &amp; Open Graph</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Custom URL Slug (Leave blank for auto-generation)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="architecting-resilient-distributed-systems"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Custom SEO Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Defaults to article title if blank"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Meta Description (Max 160 characters)
                </label>
                <input
                  type="text"
                  maxLength={160}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Defaults to excerpt if blank"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  {metaDescription.length} / 160 characters
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Controls (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Publication Status & Action Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Settings className="w-4 h-4 text-rose-600" />
                <span>Publishing Controls</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  <option value="published">Published (Live Immediately)</option>
                  <option value="draft">Draft (Private in CMS)</option>
                  <option value="scheduled">Scheduled (Auto-Publish at Date)</option>
                </select>
              </div>

              {status === 'scheduled' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Schedule Release Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    value={publishAt}
                    onChange={(e) => setPublishAt(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                  />
                </div>
              )}

              {/* Featured Switch */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800 block">Featured Article</label>
                  <span className="text-[11px] text-slate-400">Highlight in homepage hero banner</span>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={() => handleSave('published')}
                  disabled={loading}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isEditing ? 'Update & Keep Published' : 'Publish Article Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSave('draft')}
                  disabled={loading}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Save as Private Draft
                </button>
              </div>
            </div>

            {/* Cover Image Uploader */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-rose-600" />
                <span>Featured Cover Image *</span>
              </h3>

              {coverImage ? (
                <div className="space-y-2">
                  <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold shadow transition-colors cursor-pointer"
                      title="Remove cover image"
                    >
                      Remove
                    </button>
                  </div>
                  <label className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-rose-600" />
                    <span>{uploadingImage ? 'Uploading & Converting...' : 'Change Cover Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <label className="w-full py-8 px-4 bg-slate-50 hover:bg-rose-50/40 border-2 border-dashed border-slate-300 hover:border-rose-400 rounded-2xl text-xs font-semibold text-slate-600 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-rose-600 shadow-2xs">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-800 text-xs mt-1">
                      {uploadingImage ? 'Compressing & Uploading to WebP...' : 'Click to Upload Article Thumbnail'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      PNG, JPG, WebP up to 10MB (auto-converted to WebP)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Category & Author Assignment */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Author</label>
                <select
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  {authors.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name} ({a.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Architecture, Go, Cloud, Security"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>
        </div>
      </AdminNav>
    </>
  );
};

