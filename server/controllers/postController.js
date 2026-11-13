import Post from '../models/Post.js';
import Category from '../models/Category.js';
import slugify from 'slugify';

// Helper for public query filter
const getPublicFilter = () => {
  const now = new Date();
  return {
    $or: [
      { status: 'published' },
      { status: 'scheduled', publishAt: { $lte: now } },
    ],
  };
};

export const getPublicPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const { category, search, tag, sort } = req.query;

    const conditions = [getPublicFilter()];

    // Category filter
    if (category && category !== 'all' && category !== 'undefined') {
      let catDoc = null;
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        catDoc = await Category.findById(category);
      }
      if (!catDoc) {
        catDoc = await Category.findOne({ slug: category });
      }
      if (catDoc) {
        conditions.push({ category: catDoc._id });
      }
    }

    // Tag filter
    if (tag && tag !== 'undefined') {
      conditions.push({ tags: tag });
    }

    // Keyword search filter (clean array push, preventing circular reference)
    if (search && search.trim() && search !== 'undefined') {
      const searchRegex = new RegExp(search.trim(), 'i');
      conditions.push({
        $or: [
          { title: searchRegex },
          { excerpt: searchRegex },
          { tags: searchRegex },
        ],
      });
    }

    const filter = conditions.length === 1 ? conditions[0] : { $and: conditions };

    // Sort order
    let sortOptions = { publishAt: -1, createdAt: -1 };
    if (sort === 'views' || sort === 'popular') {
      sortOptions = { views: -1, publishAt: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { publishAt: 1, createdAt: 1 };
    }

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('category', 'name slug')
      .populate('author', 'name email avatar bio')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('getPublicPosts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blog posts' });
  }
};

export const getFeaturedPosts = async (req, res) => {
  try {
    const filter = {
      ...getPublicFilter(),
      isFeatured: true,
    };

    let posts = await Post.find(filter)
      .populate('category', 'name slug')
      .populate('author', 'name email avatar bio')
      .sort({ publishAt: -1, createdAt: -1 })
      .limit(5)
      .lean();

    // Fallback if no posts are explicitly marked featured: get top 3 latest
    if (posts.length === 0) {
      posts = await Post.find(getPublicFilter())
        .populate('category', 'name slug')
        .populate('author', 'name email avatar bio')
        .sort({ publishAt: -1, createdAt: -1 })
        .limit(3)
        .lean();
    }

    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch featured posts' });
  }
};

export const getTrendingPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const posts = await Post.find(getPublicFilter())
      .populate('category', 'name slug')
      .populate('author', 'name avatar')
      .sort({ views: -1, publishAt: -1 })
      .limit(limit)
      .lean();

    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch trending posts' });
  }
};

export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug })
      .populate('category', 'name slug description')
      .populate('author', 'name email avatar bio role');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    // Related articles (3 posts in same category, excluding current)
    const relatedPosts = await Post.find({
      category: post.category._id,
      _id: { $ne: post._id },
      ...getPublicFilter(),
    })
      .populate('category', 'name slug')
      .populate('author', 'name avatar')
      .sort({ publishAt: -1 })
      .limit(3)
      .lean();

    // Previous and next article navigation
    const prevPost = await Post.findOne({
      publishAt: { $lt: post.publishAt },
      ...getPublicFilter(),
    })
      .select('title slug coverImage')
      .sort({ publishAt: -1 })
      .lean();

    const nextPost = await Post.findOne({
      publishAt: { $gt: post.publishAt },
      ...getPublicFilter(),
    })
      .select('title slug coverImage')
      .sort({ publishAt: 1 })
      .lean();

    res.json({
      success: true,
      data: post,
      relatedPosts,
      navigation: {
        prev: prevPost || null,
        next: nextPost || null,
      },
    });
  } catch (error) {
    console.error('getPostBySlug error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch article details' });
  }
};

// Admin Endpoints
export const getAdminPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const { status, category, search } = req.query;
    let filter = {};

    if (status && status !== 'all' && status !== 'undefined') {
      filter.status = status;
    }

    if (category && category !== 'all' && category !== 'undefined') {
      let catId = null;
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        catId = category;
      } else {
        const catDoc = await Category.findOne({ slug: category });
        if (catDoc) catId = catDoc._id;
      }
      if (catId) {
        filter.category = catId;
      }
    }

    if (search && search.trim() && search !== 'undefined') {
      filter.title = new RegExp(search.trim(), 'i');
    }

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('category', 'name slug')
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('getAdminPosts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin posts' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('author', 'name email');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch post' });
  }
};

export const createPost = async (req, res) => {
  try {
    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      author,
      isFeatured,
      status,
      publishAt,
      seoTitle,
      metaDescription,
    } = req.body;

    if (!title || !excerpt || !content || !coverImage || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, excerpt, content, cover image, and category',
      });
    }

    // Unique slug generation
    let finalSlug = customSlug ? slugify(customSlug, { lower: true, strict: true }) : slugify(title, { lower: true, strict: true });
    let existingSlug = await Post.findOne({ slug: finalSlug });
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const postAuthor = author || req.user._id;

    const post = await Post.create({
      title,
      slug: finalSlug,
      excerpt,
      content,
      coverImage,
      category,
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : []),
      author: postAuthor,
      isFeatured: !!isFeatured,
      status: status || 'draft',
      publishAt: publishAt ? new Date(publishAt) : new Date(),
      seoTitle: seoTitle || title,
      metaDescription: metaDescription || excerpt.substring(0, 160),
    });

    const populated = await Post.findById(post._id)
      .populate('category', 'name slug')
      .populate('author', 'name email avatar');

    res.status(201).json({
      success: true,
      message: status === 'scheduled' ? 'Post scheduled successfully' : 'Post created successfully',
      data: populated,
    });
  } catch (error) {
    console.error('createPost error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create post' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      author,
      isFeatured,
      status,
      publishAt,
      seoTitle,
      metaDescription,
    } = req.body;

    if (title) post.title = title;
    if (excerpt) post.excerpt = excerpt;
    if (content) post.content = content;
    if (coverImage) post.coverImage = coverImage;
    if (category) post.category = category;
    if (author) post.author = author;
    if (isFeatured !== undefined) post.isFeatured = isFeatured;
    if (status) post.status = status;
    if (publishAt) post.publishAt = new Date(publishAt);
    if (seoTitle !== undefined) post.seoTitle = seoTitle;
    if (metaDescription !== undefined) post.metaDescription = metaDescription;

    if (tags !== undefined) {
      post.tags = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : []);
    }

    if (customSlug && customSlug !== post.slug) {
      let candidateSlug = slugify(customSlug, { lower: true, strict: true });
      const duplicate = await Post.findOne({ slug: candidateSlug, _id: { $ne: post._id } });
      if (duplicate) {
        candidateSlug = `${candidateSlug}-${Date.now().toString().slice(-4)}`;
      }
      post.slug = candidateSlug;
    }

    await post.save();

    const populated = await Post.findById(post._id)
      .populate('category', 'name slug')
      .populate('author', 'name email avatar');

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: populated,
    });
  } catch (error) {
    console.error('updatePost error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update post' });
  }
};

export const toggleFeatured = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.isFeatured = !post.isFeatured;
    await post.save();

    res.json({
      success: true,
      message: `Post ${post.isFeatured ? 'marked as featured' : 'removed from featured'}`,
      data: { isFeatured: post.isFeatured },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle featured status' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete post' });
  }
};

