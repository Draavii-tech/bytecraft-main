import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Mail,
  Shield,
  User,
  CheckCircle,
  Edit2,
  Eye,
  EyeOff,
  Check,
  X,
  Lock,
  Upload,
  Camera,
  Image as ImageIcon,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { usersApi, uploadApi } from '../../api/client';
import { AdminNav } from '../../components/admin/AdminNav';
import { Toast } from '../../components/common/Toast';
import { SEO } from '../../components/common/SEO';

export const AdminAuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: '', message: '' });

  // Create form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [role, setRole] = useState('author');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit author state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('author');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [uploadingEditAvatar, setUploadingEditAvatar] = useState(false);
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchAuthors = () => {
    setLoading(true);
    usersApi
      .getAll()
      .then((res) => {
        if (res.success) setAuthors(res.data);
      })
      .catch((err) => {
        setToast({ type: 'error', message: 'Failed to load team authors.' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  // Handle Photo Upload with Sharp WebP conversion
  const handlePhotoUpload = async (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setToast({ type: 'error', message: 'Please select a valid image file (JPEG, PNG, WebP).' });
      return;
    }

    try {
      if (isEdit) {
        setUploadingEditAvatar(true);
      } else {
        setUploadingAvatar(true);
      }

      const res = await uploadApi.uploadImage(file);
      if (res.success && res.url) {
        if (isEdit) {
          setEditAvatar(res.url);
        } else {
          setAvatar(res.url);
        }
        setToast({ type: 'success', message: 'Photo uploaded and converted to WebP successfully!' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to upload photo.' });
    } finally {
      if (isEdit) {
        setUploadingEditAvatar(false);
      } else {
        setUploadingAvatar(false);
      }
      e.target.value = '';
    }
  };

  // Handle Add New Author
  const handleCreateAuthor = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setToast({ type: 'error', message: 'Name, email, and password are required.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await usersApi.create({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role,
        bio: bio.trim(),
        avatar: avatar.trim() || undefined,
      });

      if (res.success) {
        setName('');
        setEmail('');
        setPassword('');
        setShowCreatePassword(false);
        setBio('');
        setAvatar('');
        setToast({ type: 'success', message: 'New author/team member registered!' });
        fetchAuthors();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to create author.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Start Editing Author
  const startEdit = (author) => {
    setEditingId(author._id);
    setEditName(author.name || '');
    setEditEmail(author.email || '');
    setEditRole(author.role || 'author');
    setEditBio(author.bio || '');
    setEditAvatar(author.avatar || '');
    setEditPassword('');
    setShowEditPassword(false);
  };

  // Cancel Editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditEmail('');
    setEditRole('author');
    setEditBio('');
    setEditAvatar('');
    setEditPassword('');
    setShowEditPassword(false);
  };

  // Save Author Edit
  const handleUpdateAuthor = async (e) => {
    if (e) e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      setToast({ type: 'error', message: 'Author name and email are required.' });
      return;
    }

    setUpdating(true);
    try {
      const payload = {
        name: editName.trim(),
        email: editEmail.trim(),
        role: editRole,
        bio: editBio.trim(),
        avatar: editAvatar.trim(),
      };

      if (editPassword.trim()) {
        if (editPassword.trim().length < 6) {
          setToast({ type: 'error', message: 'New password must be at least 6 characters long.' });
          setUpdating(false);
          return;
        }
        payload.password = editPassword.trim();
      }

      const res = await usersApi.update(editingId, payload);
      if (res.success) {
        setToast({ type: 'success', message: `Profile for "${editName}" updated successfully!` });
        cancelEdit();
        fetchAuthors();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to update author.' });
    } finally {
      setUpdating(false);
    }
  };

  // Delete Author
  const handleDelete = async (id, authorName) => {
    if (!window.confirm(`Are you sure you want to remove author "${authorName}"?`)) return;

    try {
      const res = await usersApi.delete(id);
      if (res.success) {
        setToast({ type: 'success', message: 'Author removed successfully.' });
        if (editingId === id) cancelEdit();
        fetchAuthors();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete author.' });
    }
  };

  return (
    <>
      <SEO title="Editorial Authors & Team — ByteCraft CMS" />

      <AdminNav
        title="Editorial Team &amp; Authors"
        subtitle="Manage contributor profiles, editorial roles, permissions, and biographies"
      >
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: '', message: '' })}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Add New Author Form (5 Columns) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs sticky top-24">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-800">
                <Plus className="w-4 h-4 text-rose-600" />
                <span>Add Author or Editor</span>
              </div>

              <form onSubmit={handleCreateAuthor} className="space-y-4">
                {/* Author Photo Upload Section */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    {avatar ? (
                      <div className="relative group shrink-0">
                        <img
                          src={avatar}
                          alt="Avatar Preview"
                          className="w-14 h-14 rounded-full object-cover border-2 border-rose-500 shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setAvatar('')}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-slate-900 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] shadow cursor-pointer transition-colors"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                        <Camera className="w-6 h-6 stroke-[1.5]" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 shadow-2xs cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5 text-rose-600" />
                        <span>{uploadingAvatar ? 'Uploading & Converting...' : avatar ? 'Change Photo' : 'Upload Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingAvatar}
                          onChange={(e) => handlePhotoUpload(e, false)}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-slate-500 mt-1">
                        JPG, PNG, WebP up to 10MB (auto-compressed)
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maya@bytecraft.io"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Password Field with Eye Toggle */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showCreatePassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCreatePassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer focus:outline-none"
                      title={showCreatePassword ? 'Hide password' : 'Show password'}
                      aria-label="Toggle password visibility"
                    >
                      {showCreatePassword ? (
                        <EyeOff className="w-4 h-4 text-rose-600" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    <option value="author">Author</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Bio &amp; Research Focus
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Principal engineer specializing in distributed systems and systems programming..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{submitting ? 'Adding...' : 'Add Team Member'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel: Authors List & Author Edit Section (7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Active Editorial Staff ({authors.length})
                </h3>
                {editingId && (
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                    <span>Edit Mode Active</span>
                  </span>
                )}
              </div>

              <div className="divide-y divide-slate-100">
                {loading ? (
                  <div className="py-8 text-center text-xs text-slate-400">Loading authors...</div>
                ) : authors.length > 0 ? (
                  authors.map((u) => {
                    const isEditingThis = editingId === u._id;

                    return (
                      <div key={u._id} className="py-4">
                        {isEditingThis ? (
                          /* AUTHOR EDIT SECTION (Inline Expanded Card with Photo Upload) */
                          <div className="p-5 rounded-2xl border-2 border-rose-500/80 bg-rose-50/20 shadow-md animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
                            {/* Section Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                    Edit Author Profile
                                  </h4>
                                  <span className="text-[11px] text-rose-600 font-semibold">
                                    Modifying details for {u.name}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Cancel Editing"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Edit Form */}
                            <form onSubmit={handleUpdateAuthor} className="space-y-4">
                              {/* Photo Upload Section */}
                              <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                  Author Photo
                                </label>
                                <div className="flex items-center gap-4 p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
                                  {editAvatar ? (
                                    <div className="relative group shrink-0">
                                      <img
                                        src={editAvatar}
                                        alt="Avatar Preview"
                                        className="w-14 h-14 rounded-full object-cover border-2 border-rose-500 shadow-xs"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setEditAvatar('')}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-slate-900 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] shadow cursor-pointer transition-colors"
                                        title="Remove photo"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                                      <Camera className="w-6 h-6 stroke-[1.5]" />
                                    </div>
                                  )}

                                  <div className="flex-1 min-w-0">
                                    <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 shadow-2xs cursor-pointer transition-colors">
                                      <Upload className="w-3.5 h-3.5 text-rose-600" />
                                      <span>
                                        {uploadingEditAvatar
                                          ? 'Uploading & Converting...'
                                          : editAvatar
                                          ? 'Replace Photo'
                                          : 'Upload New Photo'}
                                      </span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        disabled={uploadingEditAvatar}
                                        onChange={(e) => handlePhotoUpload(e, true)}
                                        className="hidden"
                                      />
                                    </label>
                                    <p className="text-[10px] text-slate-500 mt-1">
                                      Upload an image from your device (automatically compressed to WebP)
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                                    Full Name *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                                    Email Address *
                                  </label>
                                  <input
                                    type="email"
                                    required
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                                    Role
                                  </label>
                                  <select
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer"
                                  >
                                    <option value="author">Author</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                </div>

                                {/* Password Field with Eye Toggle */}
                                <div>
                                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                                    New Password (Optional)
                                  </label>
                                  <div className="relative">
                                    <input
                                      type={showEditPassword ? 'text' : 'password'}
                                      value={editPassword}
                                      onChange={(e) => setEditPassword(e.target.value)}
                                      placeholder="Leave blank to keep current"
                                      className="w-full pl-3 pr-10 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowEditPassword((prev) => !prev)}
                                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer focus:outline-none"
                                      title={showEditPassword ? 'Hide password' : 'Show password'}
                                      aria-label="Toggle password visibility"
                                    >
                                      {showEditPassword ? (
                                        <EyeOff className="w-4 h-4 text-rose-600" />
                                      ) : (
                                        <Eye className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                                  Bio &amp; Research Focus
                                </label>
                                <textarea
                                  rows={3}
                                  value={editBio}
                                  onChange={(e) => setEditBio(e.target.value)}
                                  placeholder="Author biography, credentials, and specialties..."
                                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                />
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 pt-2">
                                <button
                                  type="submit"
                                  disabled={updating}
                                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{updating ? 'Saving Changes...' : 'Save Changes'}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        ) : (
                          /* NORMAL AUTHOR CARD */
                          <div className="flex items-start justify-between gap-4 group hover:bg-slate-50/70 p-3 -mx-3 rounded-xl transition-all">
                            <div className="flex items-start gap-3.5">
                              {u.avatar ? (
                                <img
                                  src={u.avatar}
                                  alt={u.name}
                                  className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                  <User className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">
                                    {u.name}
                                  </h4>
                                  <span
                                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                      u.role === 'admin'
                                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {u.role}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <span>{u.email}</span>
                                </span>
                                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 max-w-md">
                                  {u.bio || 'Staff author & research contributor.'}
                                </p>
                              </div>
                            </div>

                            {/* Author Row Controls: Post Count + Edit Button + Delete Button */}
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs text-slate-500 mr-1 hidden sm:inline">
                                <strong>{u.postCount || 0}</strong> posts
                              </span>

                              {/* EDIT AUTHOR BUTTON */}
                              <button
                                type="button"
                                onClick={() => startEdit(u)}
                                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-all cursor-pointer"
                                title={`Edit ${u.name}'s profile`}
                                aria-label={`Edit ${u.name}`}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* DELETE AUTHOR BUTTON */}
                              <button
                                type="button"
                                onClick={() => handleDelete(u._id, u.name)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-all cursor-pointer"
                                title="Remove Author"
                                aria-label={`Delete ${u.name}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">No authors found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminNav>
    </>
  );
};
