import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Eye,
  User,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Tag,
  AlertTriangle,
  BadgeCheck,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { postsApi } from '../api/client';
import { SEO } from '../components/common/SEO';
import { TableOfContents } from '../components/blog/TableOfContents';
import { ShareButtons } from '../components/blog/ShareButtons';
import { PostCard } from '../components/blog/PostCard';

export const BlogDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [navigation, setNavigation] = useState({ prev: null, next: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [sidebarSubscribed, setSidebarSubscribed] = useState(false);
  const [subEmail, setSubEmail] = useState('');

  // Scroll to top on article change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'instant' });

    postsApi
      .getPostBySlug(slug)
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data) {
          setPost(res.data);
          setRelatedPosts(res.relatedPosts || []);
          setNavigation(res.navigation || { prev: null, next: null });
        } else {
          setError('Article not found or not yet published.');
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load article.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSidebarSubscribe = (e) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSidebarSubscribed(true);
    setSubEmail('');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse">
        <div className="h-6 w-36 bg-slate-200 rounded mb-4"></div>
        <div className="h-12 w-full bg-slate-200 rounded mb-6"></div>
        <div className="h-6 w-64 bg-slate-200 rounded mb-8"></div>
        <div className="h-96 w-full bg-slate-200 rounded-2xl mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Article Unavailable</h1>
        <p className="text-slate-600 text-sm mb-6">
          {error || "The article you're searching for does not exist or has been removed."}
        </p>
        <Link
          to="/blogs"
          className="px-5 py-2.5 bg-slate-900 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Articles</span>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.publishAt || post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <SEO
        title={post.seoTitle || post.title}
        description={post.metaDescription || post.excerpt}
        keywords={post.tags}
        image={post.coverImage}
        type="article"
        publishedTime={new Date(post.publishAt || post.createdAt).toISOString()}
        modifiedTime={new Date(post.updatedAt || post.createdAt).toISOString()}
        author={post.author}
      />

      {/* Reading Progress Indicator Bar (Sticky top) */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-slate-200/40">
        <div
          className="h-full bg-rose-600 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <article className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
            <Link to="/" className="hover:text-rose-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/blogs" className="hover:text-rose-600 transition-colors">
              Articles
            </Link>
            {post.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <Link
                  to={`/blogs?category=${post.category.slug}`}
                  className="hover:text-rose-600 transition-colors truncate max-w-[150px]"
                >
                  {post.category.name}
                </Link>
              </>
            )}
          </nav>

          {/* Article Header */}
          <header className="max-w-4xl mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.category && (
                <Link
                  to={`/blogs?category=${post.category.slug}`}
                  className="inline-block bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full hover:bg-rose-100 transition-colors"
                >
                  {post.category.name}
                </Link>
              )}
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Peer-Reviewed</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              {post.title}
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-6 font-normal">
              {post.excerpt}
            </p>

            {/* Author and Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200">
              <div className="flex items-center gap-3.5">
                {post.author?.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                    <User className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {post.author?.name || 'Ashwini RV'}
                    </h3>
                    <BadgeCheck className="w-4 h-4 text-rose-600 fill-rose-50" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {post.author?.role === 'admin'
                      ? 'Founder & Chief Technology Editor'
                      : post.author?.bio
                      ? 'Senior Technical Specialist'
                      : 'Editorial Staff'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <time dateTime={post.publishAt || post.createdAt}>{formattedDate}</time>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{post.readingTime || 4} min read</span>
                </span>
                {post.views !== undefined && post.views > 0 && (
                  <>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-slate-400" />
                      <span>{post.views.toLocaleString()} views</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Top Share Buttons */}
            <div className="pt-4">
              <ShareButtons title={post.title} />
            </div>
          </header>

          {/* Featured Cover Image */}
          <div className="max-w-5xl mb-12">
            <div className="relative aspect-16/9 rounded-3xl overflow-hidden shadow-lg bg-slate-900 border border-slate-200">
              <img
                src={post.coverImage}
                alt={post.title}
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Main Layout: Article Body + Sticky TOC Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl">
            {/* Body Content (8 Columns) */}
            <div className="lg:col-span-8 min-w-0">
              {/* Mobile Table of Contents */}
              <div className="lg:hidden mb-8">
                <TableOfContents content={post.content} />
              </div>

              {/* Rendered Rich Content */}
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags Section */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    <Tag className="w-4 h-4 text-rose-600" />
                    <span>Technical Index &amp; Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/blogs?search=${encodeURIComponent(tag)}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-semibold transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Professional Author Executive Box */}
              {post.author && (
                <div className="mt-10 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  {post.author.avatar && (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      loading="lazy"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0"
                    />
                  )}
                  <div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                      <h4 className="font-extrabold text-lg text-slate-900">
                        {post.author.name}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                        <BadgeCheck className="w-3.5 h-3.5 text-rose-600" />
                        <span>{post.author.role === 'admin' ? 'Chief Technology Editor' : 'Author'}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-semibold mb-2">
                      {post.author.role === 'admin'
                        ? 'Principal Distributed Systems Architect'
                        : 'Staff AI Researcher & Solutions Consultant'}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {post.author.bio ||
                        'Senior technical researcher focusing on distributed architectures, autonomous AI multi-agent loops, and high-throughput systems.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Share Bar */}
              <div className="mt-8 p-5 bg-white rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  Share this technical breakdown with your team:
                </span>
                <ShareButtons title={post.title} />
              </div>

              {/* Previous and Next Navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 pt-8 border-t border-slate-200">
                {navigation.prev ? (
                  <Link
                    to={`/blog/${navigation.prev.slug}`}
                    className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-1 text-xs font-bold uppercase text-slate-400 group-hover:text-rose-600 transition-colors mb-2">
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous Article</span>
                    </div>
                    <span className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-rose-600 transition-colors">
                      {navigation.prev.title}
                    </span>
                  </Link>
                ) : (
                  <div className="hidden sm:block"></div>
                )}

                {navigation.next && (
                  <Link
                    to={`/blog/${navigation.next.slug}`}
                    className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group flex flex-col justify-between text-right"
                  >
                    <div className="flex items-center justify-end gap-1 text-xs font-bold uppercase text-slate-400 group-hover:text-rose-600 transition-colors mb-2">
                      <span>Next Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-rose-600 transition-colors">
                      {navigation.next.title}
                    </span>
                  </Link>
                )}
              </div>
            </div>

            {/* Desktop Sticky Sidebar (4 Columns) */}
            <aside className="hidden lg:block lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                <TableOfContents content={post.content} />

                {/* Newsletter Box in Sidebar with Inline Success State */}
                <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>ByteCraft Dispatch</span>
                  </div>
                  <h4 className="font-extrabold text-sm mb-2">Enterprise Systems Teardowns</h4>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Get deep architectural analysis and benchmark studies sent directly to your inbox every Thursday.
                  </p>

                  {sidebarSubscribed ? (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Subscribed! Check your inbox this Thursday.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSidebarSubscribe} className="space-y-2">
                      <input
                        type="email"
                        required
                        value={subEmail}
                        onChange={(e) => setSubEmail(e.target.value)}
                        placeholder="engineer@company.com"
                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
                      />
                      <button
                        type="submit"
                        className="w-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                      >
                        Subscribe Free
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {/* Related Articles Section (3 Cards) */}
          {relatedPosts.length > 0 && (
            <section className="mt-20 pt-12 border-t border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Related Articles in {post.category?.name || 'this Topic'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Continue exploring architectural insights</p>
                </div>
                <Link
                  to={`/blogs?category=${post.category?.slug}`}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
                >
                  <span>More in this topic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((related) => (
                  <PostCard key={related._id} post={related} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
};
