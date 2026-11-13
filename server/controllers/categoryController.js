import Category from '../models/Category.js';
import Post from '../models/Post.js';
import slugify from 'slugify';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();

    // Attach published post counts
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Post.countDocuments({
          category: cat._id,
          $or: [
            { status: 'published' },
            { status: 'scheduled', publishAt: { $lte: new Date() } },
          ],
        });
        return { ...cat, postCount: count };
      })
    );

    res.json({ success: true, count: categoriesWithCount.length, data: categoriesWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    const count = await Post.countDocuments({
      category: category._id,
      $or: [
        { status: 'published' },
        { status: 'scheduled', publishAt: { $lte: new Date() } },
      ],
    });
    res.json({ success: true, data: { ...category.toObject(), postCount: count } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch category' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({ name, slug, description: description || '' });
    res.status(201).json({ success: true, message: 'Category created successfully', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create category' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true, strict: true });
    }
    if (description !== undefined) {
      category.description = description;
    }

    await category.save();
    res.json({ success: true, message: 'Category updated successfully', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update category' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const postsUsing = await Post.countDocuments({ category: category._id });
    if (postsUsing > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: ${postsUsing} posts are currently assigned to it. Please reassign them first.`,
      });
    }

    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
};

