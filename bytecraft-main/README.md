# ByteCraft — Production-Ready MERN Technology Blog

A full-stack, enterprise-grade Technology Blog and Content Management System built with the **MERN** stack (MongoDB, Express.js, React, Node.js), inspired by the editorial, content-focused layout of **Zoho Blog**.

---

## 🚀 Key Highlights & Features

### 1. Clean, Content-Focused Editorial Layout
- **Zoho Blog-Inspired Visual Design:** High-contrast typography, reading-time badges, category topic pills, author cards, and article lead highlights.
- **Live Auto-Playing Feed Carousel:** Interactive top-of-feed carousel featuring featured articles with auto-play, pause-on-hover, direct slide navigation dots, and manual previous/next controls.
- **Sign In & Sign Up Directly on Page:** User-friendly authentication replacing traditional admin login, allowing instant user registration (`/signup`) with database account creation and seamless session setup.
- **Auto-Generated Table of Contents (TOC):** Dynamically parses `<h2>` and `<h3>` tags in article bodies with smooth scroll and active scroll tracking.
- **Social Sharing:** One-click sharing for LinkedIn, X (Twitter), WhatsApp, and instant clipboard copy with toast notifications.
- **Rich Artificial Intelligence Collection:** Real, in-depth technical blogs covering Production RAG, Selective State Space Models (Mamba), Autonomous Multi-Agent Systems, and 4-Bit Edge SLM Quantization.
- **Zero Horizontal Scrolling & Mobile Overflow:** Explicit `overflow-x: hidden` safeguards and `overflow-x: auto` containers for code snippets and comparison tables across all viewport sizes (`375px` and up).

### 2. High-Performance Media Pipeline
- **Sharp WebP Image Compression:** Automatic server-side compression and conversion of uploaded JPEG/PNG/GIF images to modern `.webp` format at 80% quality.
- **Lazy Loading:** `loading="lazy"` on all below-the-fold media cards for fast core web vitals.

### 3. Dynamic SEO & Structured Data
- **Dynamic Meta Tags (`react-helmet-async`):** Unique `<title>`, `<meta name="description">`, Open Graph (`og:*`), and Twitter Card metadata per page.
- **Schema.org JSON-LD:** Structured `BlogPosting` microdata automatically injected into article pages for search engine indexing.
- **Dynamic `/sitemap.xml` & `/robots.txt`:** Live server-side XML sitemap crawling all published posts and category archives.

### 4. Protected CMS / Admin Panel
- **JWT Authentication:** Secure password hashing with `bcryptjs` and session tokens.
- **Post Manager:** Complete CRUD interface, search, category and status filtering, instant `isFeatured` homepage toggle, and view counters.
- **Rich Post Editor:** TipTap WYSIWYG editor with support for headings, bold/italic, lists, blockquotes, syntax code blocks, comparison tables, direct WebP image upload, and HTML source switching.
- **Scheduling Engine:** Ability to publish immediately, save as private draft, or schedule future publication with auto-visibility once the target timestamp passes.
- **Taxonomy & Contributor Management:** Add, edit, and delete categories and team authors with relational integrity protection.

---

## 📁 Repository Structure

```
tech-blog/
├── client/                     # Vite + React 19 Frontend
│   ├── public/
│   │   └── favicon.svg         # Branded SVG Favicon
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js       # Fetch client with JWT interceptor
│   │   ├── components/
│   │   │   ├── admin/          # CMS Nav, RichEditor (TipTap)
│   │   │   ├── blog/           # PostCard, FeaturedHero, TOC, ShareButtons, SearchBar
│   │   │   ├── common/         # SEO (Helmet), Toast, SocialIcons, ProtectedRoute
│   │   │   └── layout/         # Sticky Header, Editorial Footer, Main Layout
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication state & session recovery
│   │   ├── pages/
│   │   │   ├── HomePage.jsx    # Hero, categories, latest posts, trending
│   │   │   ├── BlogListingPage.jsx # Archive, search, filter, pagination
│   │   │   ├── BlogDetailPage.jsx  # Full article, TOC, related, sharing
│   │   │   ├── NotFoundPage.jsx    # Branded 404 handler
│   │   │   └── admin/          # Login, Dashboard, Editor, Categories, Authors
│   │   ├── App.jsx             # React Router DOM configuration
│   │   ├── index.css           # Tailwind CSS 4 & typography rules
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js          # Vite config with API proxy
│
├── server/                     # Node.js + Express + Mongoose Backend
│   ├── config/
│   │   └── db.js               # Resilient DB connector (MongoDB Atlas, Local, or Memory)
│   ├── controllers/            # auth, post, category, user controllers
│   ├── middleware/             # JWT auth protection & Sharp image processing
│   ├── models/                 # User, Category, Post schemas
│   ├── routes/                 # API endpoints & SEO routes (sitemap/robots)
│   ├── seeders/
│   │   └── seed.js             # Realistic seed dataset (7 categories + 7 articles)
│   ├── uploads/                # WebP compressed images
│   ├── .env.example            # Environment template
│   ├── package.json
│   └── server.js               # Express application entrypoint
│
├── package.json                # Root orchestration scripts
└── README.md
```

---

## ⚡ Quick Start & Setup

### Prerequisites
- **Node.js** v18+ or v20+ or v22+
- **npm** v9+

> **Note on MongoDB:** The backend automatically connects to your local MongoDB service or MongoDB Atlas if `MONGODB_URI` is provided in `server/.env`. If no external database is configured, it **automatically boots an embedded in-memory MongoDB server** with zero configuration required, seeding realistic content on initial run!

### 1. Install Dependencies

In the root project directory:
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

The server includes a pre-configured `.env.example` file.

In `server/`:
```bash
cp .env.example .env
```

Default variables inside `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/bytecraft_blog
JWT_SECRET=techpulse_production_jwt_super_secret_key_2026_!@#$%^
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
*(Leave `MONGODB_URI` blank or point to your Atlas URI; if omitted/offline, the embedded in-memory server activates seamlessly).*

### 3. Start the Backend Server

```bash
cd server
npm start
# Server listens on http://localhost:5000
```
On startup, the server automatically connects to MongoDB and seeds the 7 categories and 7 realistic technical blog posts if the database is fresh.

### 4. Start the Frontend Client

In a separate terminal:
```bash
cd client
npm run dev
# Vite runs on http://localhost:5173
```

Now open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🔐 Pre-Seeded CMS Credentials

You can test the protected Admin CMS immediately at `/admin/login` using either pre-seeded account:

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@bytecraft.io` | `Admin@123456` | Full CRUD, Categories, Authors, Publish/Schedule |
| **Author** | `marcus@bytecraft.io` | `Author@123456` | Drafts, Article Creation &amp; Management |

*(A 1-click credential selector is also conveniently built directly into the login screen).*

---

## 📡 API Endpoints Overview

### Public Endpoints
- `GET /api/posts` — Filtered & paginated article listing (`?category=`, `?search=`, `?sort=`, `?page=`)
- `GET /api/posts/featured` — Homepage hero featured stories
- `GET /api/posts/trending` — Most viewed articles sorted by views
- `GET /api/posts/slug/:slug` — Single article detail (increments views, returns TOC data, related posts, navigation)
- `GET /api/categories` — All categories with live post counts
- `GET /sitemap.xml` — Live dynamic XML sitemap
- `GET /robots.txt` — Search engine crawler directives
- `GET /api/health` — Health check status

### Protected Admin Endpoints (`Bearer <JWT>`)
- `POST /api/auth/login` — Authenticate and receive JWT
- `GET /api/auth/me` — Verify active session
- `GET /api/posts/admin/all` — Complete post manager view (Draft, Published, Scheduled)
- `POST /api/posts` — Create new article
- `PUT /api/posts/:id` — Update article
- `PATCH /api/posts/:id/featured` — Toggle featured state
- `DELETE /api/posts/:id` — Delete article
- `POST /api/upload` — Multer + Sharp WebP image compression
- `POST /api/categories` — Create category
- `PUT /api/categories/:id` — Update category
- `DELETE /api/categories/:id` — Delete category (with post validation)
- `GET /api/users` — List team authors & roles
- `POST /api/users` — Add author / administrator
- `DELETE /api/users/:id` — Remove author (with post validation)

---

## 🧪 Quality Assurance & Verification

1. **Zero Horizontal Scrolling:** Run in mobile viewports (`375px` iPhone SE, `390px` iPhone 14/15, `768px` iPad). Code blocks and tables have smooth native touch scrolling without breaking parent width.
2. **SEO Verification:** Inspect page source on `/` and `/blog/:slug` to see dynamic Open Graph tags, canonical links, and `<script type="application/ld+json">` `BlogPosting` schemas.
3. **Image Compression:** Uploading a large JPEG/PNG in the editor automatically invokes Sharp, resizing and compressing it to WebP before serving via `/uploads/*.webp`.

