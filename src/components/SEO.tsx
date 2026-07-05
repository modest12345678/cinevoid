import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  jsonLd?: Record<string, any>;
}

export default function SEO({ title, description, canonicalUrl, noindex, jsonLd }: SEOProps) {
  const defaultDescription = "CINEVIDEO is your ultimate free streaming destination. Watch trending movies, top-rated anime, Studio Ghibli classics, and the latest TV series — all in HD and 4K. No sign-up required.";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description || defaultDescription} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noindex && <meta name="robots" content="noindex, follow" />}
      {!noindex && <meta name="robots" content="index, follow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description || defaultDescription} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
