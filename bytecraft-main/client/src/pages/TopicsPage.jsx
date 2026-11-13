import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Code2,
  Cpu,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Cloud,
  TrendingUp,
  FolderOpen,
  ArrowRight,
  Search,
  BookOpen,
  Layers,
  ChevronRight,
  FileText,
  Clock,
} from 'lucide-react';
import { categoriesApi, postsApi } from '../api/client';
import { SEO } from '../components/common/SEO';

// Icon and color mapping for the 7 categories
const CATEGORY_META = {
  'software-development': {
    icon: Code2,
    gradient: 'from-blue-500 to-indigo-600',
    lightBg: 'bg-blue-50',
    textAccent: 'text-blue-600',
    borderHover: 'hover:border-blue-400',
  },
  'artificial-intelligence-machine-learning': {
    icon: Cpu,
    gradient: 'from-rose-500 to-red-600',
    lightBg: 'bg-rose-50',
    textAccent: 'text-rose-600',
    borderHover: 'hover:border-rose-400',
  },
  'web-and-mobile-app-development': {
    icon: Smartphone,
    gradient: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50',
    textAccent: 'text-emerald-600',
    borderHover: 'hover:border-emerald-400',
  },
  'technology-and-innovation': {
    icon: Sparkles,
    gradient: 'from-amber-500 to-orange-600',
    lightBg: 'bg-amber-50',
    textAccent: 'text-amber-600',
    borderHover: 'hover:border-amber-400',
  },
  cybersecurity: {
    icon: ShieldCheck,
    gradient: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50',
    textAccent: 'text-violet-600',
    borderHover: 'hover:border-violet-400',
  },
  'cloud-computing': {
    icon: Cloud,
    gradient: 'from-cyan-500 to-blue-600',
    lightBg: 'bg-cyan-50',
    textAccent: 'text-cyan-600',
    borderHover: 'hover:border-cyan-400',
  },
  'industry-insights': {
    icon: TrendingUp,
    gradient: 'from-fuchsia-500 to-pink-600',
    lightBg: 'bg-fuchsia-50',
    textAccent: 'text-fuchsia-600',
    borderHover: 'hover:border-fuchsia-400',
  },
};

const DEFAULT_META = {
  icon: FolderOpen,
  gradient: 'from-slate-600 to-slate-800',
  lightBg: 'bg-slate-50',
  textAccent: 'text-slate-700',
  borderHover: 'hover:border-slate-400',
};

export const TopicsPage = () => {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let isMounted = true;

    Promise.all([
      categoriesApi.getAll(),
      postsApi.getPublicPosts({ limit: 50 }),
    ])
      .then(([catRes, postsRes]) => {
        if (!isMounted) return;
        if (catRes.success) {
          setCategories(catRes.data);
        }
        if (postsRes.success) {
          setPosts(postsRes.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load topics:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter categories by search
  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      (cat.description && cat.description.toLowerCase().includes(q))
    );
  });

  const totalArticles = categories.reduce((sum, c) => sum + (c.postCount || 0), 0);

  return (
    <>
      <SEO
        title="Explore Topics & Categories — ByteCraft"
        description="Browse all engineering, artificial intelligence, cloud, and architecture topics covered by ByteCraft. Curated technical guides and research whitepapers led by Ashwini RV."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">Topics</span>
        </nav>

        {/* Hero Section */}
        <div className="border-b border-slate-200/90 pb-10 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider mb-4 border border-rose-100">
            <Layers className="w-3.5 h-3.5" />
            <span>Editorial Taxonomy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Explore Topics &amp; Domains
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-3xl leading-relaxed">
            Discover peer-reviewed architectural deep-dives, neural system frameworks, and engineering blueprints organized across <strong>7 specialized technology domains</strong>. Led by Founder &amp; Chief Technology Editor <strong>Ashwini RV</strong>.
          </p>

          {/* Quick Stats & Controls */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-slate-100">
            {/* Search filter for topics */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter topics by keyword..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-xs"
              />
            </div>

            {/* Quick Link to All Articles */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 hidden md:inline">
                Total Catalog: <strong className="text-slate-800">{totalArticles}</strong> Articles
              </span>
              <Link
                to="/blogs"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
              >
                <BookOpen className="w-4 h-4" />
                <span>View Full Article Archive</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4 shadow-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-200" />
                <div className="h-6 w-3/4 bg-slate-200 rounded" />
                <div className="h-4 w-full bg-slate-200 rounded" />
                <div className="h-4 w-5/6 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No matching topics found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any topic matching "{searchQuery}". Try a different keyword or browse all articles.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 text-sm font-semibold text-rose-600 hover:text-rose-700 underline cursor-pointer"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCategories.map((cat) => {
              const meta = CATEGORY_META[cat.slug] || DEFAULT_META;
              const IconComponent = meta.icon;

              // Find up to 2 posts in this category
              const categoryPosts = posts
                .filter((p) => p.category?._id === cat._id || p.category?.slug === cat.slug)
                .slice(0, 2);

              return (
                <div
                  key={cat._id}
                  className={`group relative bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between ${meta.borderHover}`}
                >
                  <div>
                    {/* Top Header: Icon + Article Count Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${meta.gradient} text-white flex items-center justify-center shadow-md shadow-slate-200 group-hover:scale-110 transition-transform duration-200`}
                      >
                        <IconComponent className="w-6 h-6 stroke-[2]" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200/80">
                        {cat.postCount || 0} {cat.postCount === 1 ? 'Article' : 'Articles'}
                      </span>
                    </div>

                    {/* Category Title */}
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                      <Link to={`/blogs?category=${cat.slug}`} className="focus:outline-none">
                        {cat.name}
                      </Link>
                    </h2>

                    {/* Category Description */}
                    <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {cat.description ||
                        `Explore cutting-edge articles, architectures, and engineering case studies in ${cat.name}.`}
                    </p>

                    {/* Sample Articles Preview */}
                    {categoryPosts.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Featured in this topic:
                        </span>
                        {categoryPosts.map((post) => (
                          <Link
                            key={post._id}
                            to={`/blog/${post.slug}`}
                            className="flex items-start gap-2 text-xs font-semibold text-slate-700 hover:text-rose-600 transition-colors group/item"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0 group-hover/item:text-rose-600" />
                            <span className="line-clamp-1">{post.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Button */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      to={`/blogs?category=${cat.slug}`}
                      className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 transition-colors group-hover:bg-rose-50 group-hover:text-rose-600"
                    >
                      <span>Browse {cat.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Editorial Callout */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl border border-slate-800">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-rose-400 uppercase">
              Looking for something specific?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
              Search our complete engineering knowledge base
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              Every article is peer-reviewed and tested in production environments. Filter by keywords, authors, tags, and publication dates.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-500 shadow-md transition-all duration-150"
              >
                <span>Browse All Articles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors border border-slate-700"
              >
                <span>Back to Homepage</span>
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
            <Layers className="w-96 h-96 text-white" />
          </div>
        </div>
      </div>
    </>
  );
};

