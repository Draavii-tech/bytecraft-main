import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Pause, Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';

export const LiveCarousel = ({ posts = [], autoPlayInterval = 4500 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef(null);

  if (!posts || posts.length === 0) return null;

  const slides = posts.slice(0, 5); // Top 5 featured articles for the carousel

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (idx) => {
    setCurrentIndex(idx);
  };

  useEffect(() => {
    if (isPlaying && slides.length > 1) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex, slides.length, autoPlayInterval]);

  const currentPost = slides[currentIndex];
  if (!currentPost) return null;

  const formattedDate = new Date(currentPost.publishAt || currentPost.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="relative mb-12 group rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-slate-950 text-white"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Background Cover Image with Gradient Layers */}
      <div className="relative aspect-16/10 sm:aspect-21/9 min-h-[380px] sm:min-h-[460px] w-full overflow-hidden">
        <img
          src={currentPost.coverImage}
          alt={currentPost.title}
          className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />

        {/* Carousel Slide Content */}
        <div className="absolute inset-0 p-6 sm:p-10 md:p-12 flex flex-col justify-end max-w-3xl z-10">
          {/* Top Live Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-600 text-white shadow-md animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>Featured Spotlight</span>
            </span>

            {currentPost.category && (
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
                {currentPost.category.name}
              </span>
            )}
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-3 text-white drop-shadow-sm hover:text-rose-400 transition-colors">
            <Link to={`/blog/${currentPost.slug}`}>{currentPost.title}</Link>
          </h2>

          {/* Excerpt */}
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 sm:line-clamp-3 mb-5 max-w-2xl">
            {currentPost.excerpt}
          </p>

          {/* Metadata & CTA Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              {currentPost.author?.avatar && (
                <img
                  src={currentPost.author.avatar}
                  alt={currentPost.author.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-rose-500/80 shadow-md"
                />
              )}
              <div className="text-xs">
                <p className="font-bold text-white">{currentPost.author?.name || 'ByteCraft Staff'}</p>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span>{formattedDate}</span>
                  <span>&bull;</span>
                  <span>{currentPost.readingTime || 4} min read</span>
                </div>
              </div>
            </div>

            <Link
              to={`/blog/${currentPost.slug}`}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all duration-150 inline-flex items-center gap-2 shadow-lg shadow-rose-600/30 group/btn"
            >
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Carousel Slide Counter */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono font-bold text-slate-300">
          <span className="text-rose-400">0{currentIndex + 1}</span>
          <span className="text-slate-600">/</span>
          <span>0{slides.length}</span>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-rose-600 text-white backdrop-blur-md flex items-center justify-center border border-white/10 opacity-70 group-hover:opacity-100 transition-all focus:outline-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-rose-600 text-white backdrop-blur-md flex items-center justify-center border border-white/10 opacity-70 group-hover:opacity-100 transition-all focus:outline-none"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Carousel Bottom Control Bar: Dots & Play/Pause */}
      <div className="px-6 py-3 bg-slate-950/90 border-t border-white/10 flex items-center justify-between">
        {/* Slide Indicator Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-rose-600' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={() => setIsPlaying((prev) => !prev)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors focus:outline-none"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Pause Live Feed</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Play Live Feed</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

