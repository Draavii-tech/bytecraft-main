import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Calendar, User } from 'lucide-react';

export const PostCard = ({ post, featured = false }) => {
  if (!post) return null;

  const formattedDate = new Date(post.publishAt || post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article
      className={`group flex flex-col bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 ${
        featured ? 'md:flex-row' : ''
      }`}
    >
      {/* Cover Image */}
      <Link
        to={`/blog/${post.slug}`}
        className={`relative block overflow-hidden bg-slate-100 ${
          featured ? 'md:w-1/2 min-h-[260px]' : 'aspect-16/9 w-full'
        }`}
        aria-label={`Read article: ${post.title}`}
      >
        <img
          src={post.coverImage}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {post.category && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-rose-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            {post.category.name}
          </span>
        )}
      </Link>

      {/* Content Body */}
      <div className={`flex flex-col justify-between p-6 ${featured ? 'md:w-1/2 p-8' : ''}`}>
        <div>
          {/* Metadata Bar */}
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <time dateTime={post.publishAt || post.createdAt}>{formattedDate}</time>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.readingTime || 4} min read</span>
            </span>
            {post.views !== undefined && post.views > 0 && (
              <>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{post.views.toLocaleString()}</span>
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3
            className={`font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-snug tracking-tight line-clamp-2 ${
              featured ? 'text-2xl md:text-3xl mb-3' : 'text-xl mb-2.5'
            }`}
          >
            <Link to={`/blog/${post.slug}`} className="focus:outline-none">
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p
            className={`text-slate-600 leading-relaxed text-sm line-clamp-3 ${
              featured ? 'text-base mb-6' : 'mb-5'
            }`}
          >
            {post.excerpt}
          </p>
        </div>

        {/* Author Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-3">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                loading="lazy"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <User className="w-4 h-4" />
              </div>
            )}
            <div className="text-xs">
              <p className="font-semibold text-slate-900">{post.author?.name || 'ByteCraft Staff'}</p>
              <p className="text-slate-500">{post.author?.bio ? 'Author' : 'Editorial'}</p>
            </div>
          </div>

          <Link
            to={`/blog/${post.slug}`}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 group/btn"
          >
            <span>Read Article</span>
            <span className="group-hover/btn:translate-x-0.5 transition-transform">&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

