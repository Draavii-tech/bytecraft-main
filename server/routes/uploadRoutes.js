import express from 'express';
import { upload, processImage } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), processImage, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded or invalid file format' });
  }

  res.status(200).json({
    success: true,
    message: 'Image uploaded, compressed, and converted to WebP successfully',
    url: req.file.url,
    filename: req.file.filename,
  });
});

export default router;

