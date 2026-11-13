import express from 'express';
import Post from '../models/Post.js';
import Category from '../models/Category.js';

const router = express.Router();

router.get('/robots.txt', (req, res) => {
  const host = `${req.protocol}://${req.get('host')}`;
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${host}/sitemap.xml
`;
  res.type('text/plain');
  res.send(robotsTxt);
});

router.get('/sitemap.xml', async (req, res) => {
  try {
    const host = `${req.protocol}://${req.get('host')}`;
    const now = new Date();

    const posts = await Post.find({
      $or: [
        { status: 'published' },
        { status: 'scheduled', publishAt: { $lte: now } },
      ],
    })
      .select('slug updatedAt createdAt')
      .lean();

    const categories = await Category.find().select('slug updatedAt').lean();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    xml += `  <url>\n    <loc>${host}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${host}/blogs</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

    // Categories
    categories.forEach((cat) => {
      xml += `  <url>\n    <loc>${host}/blogs?category=${cat.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // Posts
    posts.forEach((post) => {
      const lastMod = new Date(post.updatedAt || post.createdAt).toISOString();
      xml += `  <url>\n    <loc>${host}/blog/${post.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.type('application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

export default router;

