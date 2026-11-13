import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, Sparkles, TrendingUp, CheckCircle } from 'lucide-react';

export const FeaturedHero = ({ posts = [] }) => {
  const [heroSubscribed, setHeroSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  if (!posts || posts.length === 0) return null;

  const leadPost = posts[0];
  const sidePosts = posts.slice(1, 4);

  const formatLeadDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  const handleHeroSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setHeroSubscribed(true);
    setEmailInput('');
  };

  return (
    <section className="mb-14">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 bg-rose-600 rounded-xs"></div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Editor's Pick &amp; Top Stories
          </h2>
        </div>
        <Link
          to="/blogs"
          className="text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 group"
        >
          <span>View all stories</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Lead Feature (8 Columns on Desktop) */}
        {leadPost && (
          <div className="lg:col-span-7 xl:col-span-8 group flex flex-col bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
            <Link
              to={`/blog/${leadPost.slug}`}
              className="relative aspect-16/10 w-full overflow-hidden bg-slate-900 block"
            >
              <img
                src={leadPost.coverImage}
                alt={leadPost.title}
                loading="eager"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

              {leadPost.category && (
                <div className="absolute top-4 left-4">
                  <span className="bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                    {leadPost.category.name}
                  </span>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 text-white hidden sm:block">
                <div className="flex items-center gap-3 text-xs text-slate-200 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    <time dateTime={leadPost.publishAt || leadPost.createdAt}>
                      {formatLeadDate(leadPost.publishAt || leadPost.createdAt)}
                    </time>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-400" />
                    <span>{leadPost.readingTime || 4} min read</span>
                  </span>
                </div>
              </div>
            </Link>

            <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-rose-600 transition-colors tracking-tight leading-tight mb-3">
                  <Link to={`/blog/${leadPost.slug}`}>
                    {leadPost.title}
                  </Link>
                </h3>
                <p className="text-slate-600 text-base leading-relaxed line-clamp-3 mb-6 font-normal">
                  {leadPost.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                <div className="flex items-center gap-3">
                  {leadPost.author?.avatar && (
                    <img
                      src={leadPost.author.avatar}
                      alt={leadPost.author.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-slate-100"
                    />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {leadPost.author?.name || 'Ashwini RV'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {leadPost.author?.role === 'admin' ? 'Chief Technology Editor' : 'Author'}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/blog/${leadPost.slug}`}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-rose-600 text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span>Read Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Featured Articles Column (5 Columns on Desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 px-1">
            <TrendingUp className="w-4 h-4 text-rose-600" />
            <span>Trending Highlights</span>
          </div>

          <div className="space-y-4">
            {sidePosts.map((post) => (
              <article
                key={post._id}
                className="group p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex gap-4 items-start"
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100"
                >
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="flex flex-col justify-between flex-grow min-w-0">
                  {post.category && (
                    <span className="text-[11px] font-bold uppercase text-rose-600 tracking-wide mb-1 block truncate">
                      {post.category.name}
                    </span>
                  )}
                  <h4 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors text-sm sm:text-base leading-snug line-clamp-2 mb-2">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span>
                      {new Date(post.publishAt || post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span>&bull;</span>
                    <span>{post.readingTime || 3} min read</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Quick Newsletter Box with Inline Feedback */}
          <div className="mt-auto bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-sm border border-slate-800">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Weekly Engineering Dispatch</span>
            </div>
            <h4 className="font-extrabold text-base mb-2">Stay ahead of modern tech shifts</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Curated architectural teardowns, systems thinking, and technical breakthroughs directly to your inbox every Thursday.
            </p>

            {heroSubscribed ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscribed! Check your inbox this Thursday.</span>
              </div>
            ) : (
              <form onSubmit={handleHeroSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="developer@company.com"
                  className="bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 text-xs rounded-lg px-3 py-2 flex-grow focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
