import React, { useEffect, useState } from 'react';
import { List, ChevronRight } from 'lucide-react';

export const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!content) return;

    // Parse headings from the content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headingElements = doc.querySelectorAll('h2, h3');

    const parsedHeadings = Array.from(headingElements).map((el, index) => {
      const text = el.textContent || '';
      // Create a deterministic slug ID
      const id = el.id || text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `section-${index}`;
      return {
        id,
        text,
        level: el.tagName.toLowerCase(), // 'h2' or 'h3'
      };
    });

    setHeadings(parsedHeadings);

    // Also attach ids to DOM elements once rendered
    const timeout = setTimeout(() => {
      const liveHeadings = document.querySelectorAll('.article-content h2, .article-content h3');
      liveHeadings.forEach((el, index) => {
        const text = el.textContent || '';
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `section-${index}`;
        el.id = id;
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [content]);

  // Track active heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headingDoms = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean);

      const scrollPosition = window.scrollY + 120;

      for (let i = headingDoms.length - 1; i >= 0; i--) {
        const el = headingDoms[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveId(el.id);
          return;
        }
      }

      if (headingDoms.length > 0 && window.scrollY < headingDoms[0].offsetTop - 120) {
        setActiveId('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-800">
        <List className="w-4 h-4 text-rose-600" />
        <span>Table of Contents</span>
      </div>

      <ul className="space-y-1.5 text-xs">
        {headings.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={`${item.level === 'h3' ? 'pl-3' : 'pl-0'}`}
            >
              <button
                type="button"
                onClick={() => scrollToHeading(item.id)}
                className={`text-left w-full py-1 px-2 rounded-md transition-colors flex items-start gap-1.5 group ${
                  isActive
                    ? 'text-rose-600 font-bold bg-rose-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 mt-0.5 transition-transform ${
                    isActive ? 'text-rose-600 rotate-90' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="line-clamp-2 leading-relaxed">{item.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

