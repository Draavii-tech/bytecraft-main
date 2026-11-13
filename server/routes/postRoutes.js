import express from 'express';
import {
  getPublicPosts,
  getFeaturedPosts,
  getTrendingPosts,
  getPostBySlug,
  getAdminPosts,
  getPostById,
  createPost,
  updatePost,
  toggleFeatured,
  deletePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPublicPosts);
router.get('/featured', getFeaturedPosts);
router.get('/trending', getTrendingPosts);
router.get('/slug/:slug', getPostBySlug);

// Admin routes
router.get('/admin/all', protect, getAdminPosts);
router.get('/:id', protect, getPostById);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.patch('/:id/featured', protect, toggleFeatured);
router.delete('/:id', protect, deletePost);

export default router;

