import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  schema,
}) => {
  const siteTitle = 'ByteCraft — Technology & Engineering Editorial';
  const fullTitle = title ? `${title} | ByteCraft` : siteTitle;
  const metaDescription =
    description ||
    'ByteCraft delivers rigorous technical insights, distributed architecture blueprints, cybersecurity practices, and engineering analysis.';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://bytecraft.io';
  const canonicalUrl = url ? `${siteUrl}${url}` : (typeof window !== 'undefined' ? window.location.href : siteUrl);
  const metaImage = image || `${siteUrl}/favicon.svg`;

  // Auto-generate JSON-LD BlogPosting schema if this is an article
  let structuredData = schema;
  if (!structuredData && type === 'article') {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: metaDescription,
      image: [metaImage],
      datePublished: publishedTime || new Date().toISOString(),
      dateModified: modifiedTime || publishedTime || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: author?.name || 'ByteCraft Editorial Team',
        url: author?.avatar || undefined,
      },
      publisher: {
        '@type': 'Organization',
        name: 'ByteCraft',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/favicon.svg`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
    };
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={Array.isArray(keywords) ? keywords.join(', ') : keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content="ByteCraft" />

      {/* Article Specific Open Graph */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author?.name && (
        <meta property="article:author" content={author.name} />
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

