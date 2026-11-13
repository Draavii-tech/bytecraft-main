import User from '../models/User.js';
import Post from '../models/Post.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ name: 1 }).lean();

    const usersWithCounts = await Promise.all(
      users.map(async (u) => {
        const postCount = await Post.countDocuments({ author: u._id });
        return { ...u, postCount };
      })
    );

    res.json({ success: true, count: usersWithCounts.length, data: usersWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch authors' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, bio, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: role || 'author',
      bio: bio || 'Technology Writer & Engineer',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    res.status(201).json({
      success: true,
      message: 'Author/User created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create user' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, bio, avatar } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Author/User not found' });
    }

    // Check email uniqueness if email is changed
    if (email && email.toLowerCase().trim() !== user.email) {
      const existing = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: id },
      });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Another user with this email already exists' });
      }
      user.email = email.toLowerCase().trim();
    }

    if (name && name.trim()) user.name = name.trim();
    if (role && ['admin', 'author'].includes(role)) user.role = role;
    if (bio !== undefined) user.bio = bio.trim();
    if (avatar !== undefined) user.avatar = avatar.trim();

    if (password && password.trim().length >= 6) {
      user.passwordHash = await User.hashPassword(password.trim());
    }

    await user.save();

    res.json({
      success: true,
      message: 'Author profile updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update author' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const postCount = await Post.countDocuments({ author: user._id });
    if (postCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete author: ${postCount} posts are linked to this author. Reassign posts first.`,
      });
    }

    await user.deleteOne();
    res.json({ success: true, message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

