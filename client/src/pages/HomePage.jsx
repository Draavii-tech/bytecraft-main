import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, ArrowRight, Grid, Filter, RefreshCw, Flame } from 'lucide-react';
import { postsApi, categoriesApi } from '../api/client';
import { SEO } from '../components/common/SEO';
import { LiveCarousel } from '../components/blog/LiveCarousel';
import { FeaturedHero } from '../components/blog/FeaturedHero';
import { PostCard } from '../components/blog/PostCard';
import { SearchBar } from '../components/blog/SearchBar';

export const HomePage = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Initial data load
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      postsApi.getFeaturedPosts(),
      postsApi.getTrendingPosts(4),
      categoriesApi.getAll(),
    ])
      .then(([featRes, trendRes, catRes]) => {
        if (!isMounted) return;
        if (featRes.success) setFeaturedPosts(featRes.data);
        if (trendRes.success) setTrendingPosts(trendRes.data);
        if (catRes.success) setCategories(catRes.data);
      })
      .catch((err) => {
        if (isMounted) setError('Unable to load blog feed. Please try again.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch filtered latest posts whenever category or debounced search changes
  useEffect(() => {
    let isMounted = true;

    const handler = setTimeout(() => {
      const params = {
        limit: 6,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery.trim() || undefined,
      };

      postsApi
        .getPublicPosts(params)
        .then((res) => {
          if (isMounted && res.success) {
            setLatestPosts(res.data);
          }
        })
        .catch(() => {});
    }, 250);

    return () => {
      clearTimeout(handler);
      isMounted = false;
    };
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <SEO
        title="Engineering Insights, Cloud Architecture &amp; Tech Systems"
        description="A premier editorial tech publication exploring high-throughput distributed systems, autonomous AI agents, cybersecurity Zero Trust, and modern web engineering."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Editorial Sub-Headline */}
        <div className="mb-10 text-center sm:text-left border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ByteCraft Editorial Review</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <span>Chief Editor: <strong className="text-slate-900">Ashwini RV</strong></span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Perspectives on Modern Engineering, Distributed Systems &amp; AI
          </h1>
          <p className="mt-3 text-slate-600 text-base sm:text-lg max-w-3xl leading-relaxed font-normal">
            Written and reviewed by practicing software architects. High technical rigor with zero placeholder fluff, covering the frontiers of scalable cloud infrastructure, autonomous AI agents, and enterprise software design.
          </p>
        </div>

        {/* Live Auto-Playing Carousel for Blog Feed */}
        {featuredPosts.length > 0 && <LiveCarousel posts={featuredPosts} />}

        {/* Featured Hero Section */}
        {featuredPosts.length > 0 && <FeaturedHero posts={featuredPosts} />}

        {/* Interactive Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 mb-10 shadow-xs">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-rose-600" />
                <span>Explore Articles by Topic</span>
              </h2>
              <p className="text-xs text-slate-500">Filter stories or search across our technical archive</p>
            </div>

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />
          </div>

          {/* Category Tabs/Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                selectedCategory === 'all'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                  selectedCategory === cat.slug
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat.name}</span>
                {cat.postCount !== undefined && cat.postCount > 0 && (
                  <span
                    className={`ml-2 px-1.5 py-0.2 rounded-full text-[10px] ${
                      selectedCategory === cat.slug ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.postCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Latest Articles Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-6 bg-rose-600 rounded-xs"></div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {selectedCategory === 'all'
                  ? 'Latest Articles'
                  : `Topic: ${categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}`}
              </h2>
            </div>
            <Link
              to={`/blogs${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`}
              className="text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 group"
            >
              <span>View full archive</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-slate-200 h-96 animate-pulse p-6">
                  <div className="bg-slate-200 h-48 rounded-xl mb-4"></div>
                  <div className="bg-slate-200 h-5 w-3/4 rounded mb-2"></div>
                  <div className="bg-slate-200 h-4 w-full rounded mb-1"></div>
                  <div className="bg-slate-200 h-4 w-2/3 rounded"></div>
                </div>
              ))}
            </div>
          ) : latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-2">No matching articles found</h3>
              <p className="text-sm text-slate-500 mb-4">
                No articles match the current filter or search criteria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </section>

        {/* Popular / Trending Section */}
        {trendingPosts.length > 0 && (
          <section className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800">
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500">
                  <Flame className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Most Read &amp; Trending</h2>
                  <p className="text-xs text-slate-400">High-impact stories driving engineering discussions</p>
                </div>
              </div>
              <Link
                to="/blogs?sort=popular"
                className="text-xs sm:text-sm font-semibold text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 group"
              >
                <span>View all trending</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingPosts.map((post, idx) => (
                <article
                  key={post._id}
                  className="group flex flex-col justify-between bg-slate-800/60 hover:bg-slate-800 rounded-2xl p-5 border border-slate-700/60 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-black text-rose-500/80">#0{idx + 1}</span>
                      {post.category && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 bg-slate-700/80 px-2 py-0.5 rounded-full">
                          {post.category.name}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white group-hover:text-rose-400 transition-colors text-base leading-snug line-clamp-2 mb-3">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/60 text-xs text-slate-400">
                    <span>{post.readingTime || 4} min read</span>
                    <span className="text-rose-400 font-semibold">{post.views?.toLocaleString()} reads</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

