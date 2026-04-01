import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  type?: 'website' | 'article';
  /** JSON-LD structured data objects */
  schemas?: Record<string, unknown>[];
  /** Single schema for backwards compat */
  schema?: Record<string, unknown>;
}

const SITE_NAME = 'Airport TSA Times';
const BASE_URL = 'https://airporttsatimes.com';
const DEFAULT_DESCRIPTION = 'Real-time crowdsourced TSA security wait times at 48+ US airports. Check current security line wait times, report your experience, and plan ahead before you fly.';

export default function SEO({ title, description, path = '/', type = 'website', schemas, schema }: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Live TSA Security Wait Times at US Airports`;
  const desc = description || DEFAULT_DESCRIPTION;
  const url = `${BASE_URL}${path}`;

  const allSchemas = schemas || (schema ? [schema] : []);

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
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />

      {/* Structured Data */}
      {allSchemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}

/** JSON-LD schemas for the homepage */
export function homeSchemas(airportCount: number, reportCount: number) {
  const websiteSchema = {
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
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    description: `Crowdsourced TSA security wait time data from ${airportCount} US airports with ${reportCount}+ traveler reports.`,
  };

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: BASE_URL,
    applicationCategory: 'TravelApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: `Free real-time TSA security checkpoint wait times at ${airportCount} US airports. Crowdsourced from ${reportCount}+ traveler reports and social media analysis.`,
  };

  return [websiteSchema, orgSchema, webAppSchema];
}

/** JSON-LD schemas for an airport detail page */
export function airportSchemas(airport: {
  code: string;
  name: string;
  city: string;
  state: string;
  checkpoints: string[];
  avgWait?: number;
  reportCount?: number;
}) {
  const airportUrl = `${BASE_URL}/airport/${airport.code.toLowerCase()}`;

  const airportSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Airport',
    name: `${airport.name} (${airport.code})`,
    iataCode: airport.code,
    address: {
      '@type': 'PostalAddress',
      addressLocality: airport.city,
      addressRegion: airport.state,
      addressCountry: 'US',
    },
    url: airportUrl,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'All Airports',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${airport.code} — ${airport.city}`,
        item: airportUrl,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How long is the TSA security line at ${airport.name} (${airport.code})?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: airport.avgWait !== undefined
            ? `The current average TSA wait time at ${airport.code} is ${airport.avgWait} minutes, based on ${airport.reportCount || 0} recent traveler reports. Wait times vary by time of day and terminal — early morning flights (5-6am) typically have the shortest lines.`
            : `Check Airport TSA Times for real-time crowdsourced security wait times at ${airport.name}. Reports are submitted by travelers and analyzed from social media.`,
        },
      },
      {
        '@type': 'Question',
        name: `Which security checkpoint is fastest at ${airport.code}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${airport.code} has ${airport.checkpoints.length} security checkpoints: ${airport.checkpoints.join(', ')}. Check our live data to see which checkpoint currently has the shortest wait time.`,
        },
      },
      {
        '@type': 'Question',
        name: `Does ${airport.code} have TSA PreCheck?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, ${airport.name} offers TSA PreCheck lanes. PreCheck typically reduces wait times to 5-10 minutes. The program costs $78 for 5 years.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the best time to go through TSA at ${airport.code}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The shortest TSA wait times at ${airport.code} are typically during early morning (5-6am) and late evening hours. Midday and late afternoon tend to have the longest lines. Check our hourly trend chart for ${airport.code} to see patterns.`,
        },
      },
    ],
  };

  return [airportSchema, breadcrumbSchema, faqSchema];
}
