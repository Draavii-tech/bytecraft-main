import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw, BookOpen } from 'lucide-react';
import { postsApi, categoriesApi } from '../api/client';
import { SEO } from '../components/common/SEO';
import { PostCard } from '../components/blog/PostCard';
import { SearchBar } from '../components/blog/SearchBar';

export const BlogListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'latest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Fetch Categories
  useEffect(() => {
    categoriesApi
      .getAll()
      .then((res) => {
        if (res.success) setCategories(res.data);
      })
      .catch(() => {});
  }, []);

  // Sync searchInput if URL changes
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Fetch Posts based on URL params
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const params = {
      page: currentPage,
      limit: 9,
      category: currentCategory !== 'all' ? currentCategory : undefined,
      search: currentSearch.trim() || undefined,
      sort: currentSort,
    };

    postsApi
      .getPublicPosts(params)
      .then((res) => {
        if (isMounted && res.success) {
          setPosts(res.data);
          setPagination(res.pagination);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentCategory, currentSearch, currentSort, currentPage]);

  const updateFilters = (updates) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === '' || val === 'all') {
        newParams.delete(key);
      } else {
        newParams.set(key, val);
      }
    });

    // Reset to page 1 on filter or search change, unless page was explicitly set
    if (!updates.page && updates.page !== 1) {
      newParams.delete('page');
    }

    setSearchParams(newParams);
  };

  const handleSearchSubmit = (val) => {
    updateFilters({ search: val });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      updateFilters({ page: newPage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentCategoryName =
    currentCategory === 'all'
      ? 'All Articles'
      : categories.find((c) => c.slug === currentCategory)?.name || currentCategory;

  return (
    <>
      <SEO
        title={`${currentCategoryName} — Articles & Guides`}
        description={`Explore articles in ${currentCategoryName}. In-depth engineering, software architecture, security, and scalable systems insights on ByteCraft.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-8 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">
            <BookOpen className="w-4 h-4" />
            <span>ByteCraft Archive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {currentCategoryName}
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
            {currentCategory === 'all'
              ? 'Browse our complete catalog of distributed systems architecture, artificial intelligence frameworks, and cloud engineering articles.'
              : categories.find((c) => c.slug === currentCategory)?.description ||
                `Browse articles categorized under ${currentCategoryName}.`}
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 mb-8 shadow-xs flex flex-col gap-4">
          {/* Top Filter Controls: Search and Selects */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <SearchBar
              value={searchInput}
              onChange={(val) => {
                setSearchInput(val);
                updateFilters({ search: val });
              }}
              onClear={() => {
                setSearchInput('');
                updateFilters({ search: '' });
              }}
              placeholder="Search within articles..."
            />

            <div className="flex flex-wrap items-center gap-3">
              {/* Category Select */}
              <div className="relative">
                <select
                  value={currentCategory}
                  onChange={(e) => updateFilters({ category: e.target.value })}
                  className="appearance-none bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer"
                  aria-label="Filter by Category"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name} ({cat.postCount || 0})
                    </option>
                  ))}
                </select>
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>

              {/* Sort Select */}
              <div className="relative">
                <select
                  value={currentSort}
                  onChange={(e) => updateFilters({ sort: e.target.value })}
                  className="appearance-none bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer"
                  aria-label="Sort Articles"
                >
                  <option value="latest">Latest Published</option>
                  <option value="popular">Most Viewed</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>

              {/* Clear All Filters */}
              {(currentCategory !== 'all' || currentSearch || currentSort !== 'latest') && (
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Horizontal Topic Pills for Instant Switching */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
              <button
                type="button"
                onClick={() => updateFilters({ category: 'all' })}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  currentCategory === 'all'
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
                  onClick={() => updateFilters({ category: cat.slug })}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    currentCategory === cat.slug
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.postCount !== undefined && cat.postCount > 0 && (
                    <span
                      className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                        currentCategory === cat.slug ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cat.postCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <Link
              to="/topics"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline shrink-0 hidden sm:inline-flex items-center gap-1"
            >
              <span>Explore topics</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-6 px-1">
          <span>
            Showing <strong className="text-slate-800">{posts.length}</strong> of{' '}
            <strong className="text-slate-800">{pagination.total}</strong> articles
          </span>
          {pagination.totalPages > 1 && (
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
          )}
        </div>

        {/* Posts Grid */}
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
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePageChange(p)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
                        p === pagination.page
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No matching articles found</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              We couldn't find any articles matching your search or filter selection. Try clearing your search or switching categories.
            </p>
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="px-5 py-2.5 bg-slate-900 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

