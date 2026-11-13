import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { LinkedInIcon, TwitterXIcon, WhatsAppIcon } from '../common/SocialIcons';

export const ShareButtons = ({ title, url }) => {
  const [copied, setCopied] = useState(false);

  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Read this article on ByteCraft';

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mr-2">
        <Share2 className="w-4 h-4 text-rose-600" />
        <span>Share:</span>
      </div>

      {/* LinkedIn */}
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0A66C2] text-slate-700 hover:text-white text-xs font-semibold transition-colors duration-150"
        title="Share on LinkedIn"
      >
        <LinkedInIcon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">LinkedIn</span>
      </a>

      {/* X / Twitter */}
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-black text-slate-700 hover:text-white text-xs font-semibold transition-colors duration-150"
        title="Share on X (Twitter)"
      >
        <TwitterXIcon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">X</span>
      </a>

      {/* WhatsApp */}
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#25D366] text-slate-700 hover:text-white text-xs font-semibold transition-colors duration-150"
        title="Share on WhatsApp"
      >
        <WhatsAppIcon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopyLink}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
          copied
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
        }`}
        title="Copy article link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Link Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy Link</span>
          </>
        )}
      </button>

      {/* Toast Notification */}
      {copied && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-sm border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Article link copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};
