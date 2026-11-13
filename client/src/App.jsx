import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { BlogListingPage } from './pages/BlogListingPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { TopicsPage } from './pages/TopicsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Authentication Pages
import { SignInPage } from './pages/auth/SignInPage';
import { SignUpPage } from './pages/auth/SignUpPage';

// Admin CMS Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminPostEditorPage } from './pages/admin/AdminPostEditorPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminAuthorsPage } from './pages/admin/AdminAuthorsPage';

export default function App() {
  return (
    <Routes>
      {/* Public Editorial Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="blogs" element={<BlogListingPage />} />
        <Route path="topics" element={<TopicsPage />} />
        <Route path="categories" element={<TopicsPage />} />
        <Route path="blog/:slug" element={<BlogDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* User Authentication: Sign In & Sign Up */}
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<SignInPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route path="/admin/login" element={<SignInPage />} />

      {/* Protected Admin CMS Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/posts/new" element={<AdminPostEditorPage />} />
        <Route path="/admin/posts/edit/:id" element={<AdminPostEditorPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/authors" element={<AdminAuthorsPage />} />
      </Route>
    </Routes>
  );
}
