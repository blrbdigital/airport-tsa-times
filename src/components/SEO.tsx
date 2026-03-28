import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  type?: 'website' | 'article';
  /** JSON-LD structured data object */
  schema?: Record<string, unknown>;
}

const SITE_NAME = 'Airport TSA Times';
const BASE_URL = 'https://airporttsatimes.blrbdigital.com';
const DEFAULT_DESCRIPTION = 'Real-time crowdsourced TSA wait times at airports across the United States. Report and check security line wait times before you fly.';

export default function SEO({ title, description, path = '/', type = 'website', schema }: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Real-Time Crowdsourced Wait Times`;
  const desc = description || DEFAULT_DESCRIPTION;
  const url = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

/** JSON-LD for the homepage */
export function homeSchema(airportCount: number, reportCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/airport/{search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    about: {
      '@type': 'Thing',
      name: 'TSA Security Checkpoint Wait Times',
      description: `Crowdsourced data from ${airportCount} airports with ${reportCount} traveler reports.`,
    },
  };
}

/** JSON-LD for an airport detail page */
export function airportSchema(airport: {
  code: string;
  name: string;
  city: string;
  state: string;
  avgWait?: number;
  reportCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${airport.name} (${airport.code})`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: airport.city,
      addressRegion: airport.state,
      addressCountry: 'US',
    },
    additionalType: 'Airport',
    ...(airport.avgWait !== undefined && {
      review: {
        '@type': 'Review',
        reviewBody: `Average TSA security wait time: ${airport.avgWait} minutes based on ${airport.reportCount || 0} traveler reports.`,
        author: { '@type': 'Organization', name: SITE_NAME },
      },
    }),
  };
}
