import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

// Multer memory storage (safe for both serverless and traditional hosting)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const timestamp = Date.now();
    const cleanOriginalName = (req.file.originalname || 'upload')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const filename = `${cleanOriginalName}-${timestamp}.webp`;

    let webpBuffer;
    try {
      // Compress & convert to WebP using Sharp
      webpBuffer = await sharp(req.file.buffer)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();
    } catch (sharpErr) {
      console.warn('Sharp compression failed, using original file buffer:', sharpErr.message);
      webpBuffer = req.file.buffer;
    }

    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

    // In serverless environments (e.g. Vercel), local disk is read-only.
    // We convert the processed image to a Base64 Data URI so it stores directly in MongoDB
    // without requiring local disk writes or external cloud storage.
    if (isServerless) {
      const mime = webpBuffer === req.file.buffer ? req.file.mimetype : 'image/webp';
      const base64 = webpBuffer.toString('base64');
      req.file.filename = filename;
      req.file.url = `data:${mime};base64,${base64}`;
      return next();
    }

    // In local development, write to uploads directory if possible
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const outputPath = path.join(uploadsDir, filename);
      await fs.promises.writeFile(outputPath, webpBuffer);
      req.file.filename = filename;
      req.file.path = outputPath;
      req.file.url = `/uploads/${filename}`;
    } catch (fsErr) {
      console.warn('Filesystem write failed, falling back to base64 Data URI:', fsErr.message);
      const mime = webpBuffer === req.file.buffer ? req.file.mimetype : 'image/webp';
      const base64 = webpBuffer.toString('base64');
      req.file.filename = filename;
      req.file.url = `data:${mime};base64,${base64}`;
    }

    next();
  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({ success: false, message: 'Image processing failed: ' + error.message });
  }
};
