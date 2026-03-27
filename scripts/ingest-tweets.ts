/**
 * TSA Tweet Ingestion Pipeline
 *
 * Searches Twitter for TSA wait time mentions, extracts airport + wait time,
 * and inserts into Supabase. Run on a cron (every 30 min).
 *
 * Usage: SOCIALDATA_API_KEY=xxx npx tsx scripts/ingest-tweets.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://axixhkgmsxuxpnbdbvzu.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4aXhoa2dtc3h1eHBuYmRidnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDY0NzA2NCwiZXhwIjoyMDkwMjIzMDY0fQ.HurKGX7smuUGK3k7om-8GDVjtmnF-l1gXgO01izwOPY';
const SOCIALDATA_KEY = process.env.SOCIALDATA_API_KEY || '';

if (!SOCIALDATA_KEY) {
  console.error('Missing SOCIALDATA_API_KEY env var');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// IATA codes for matching
const AIRPORT_CODES = new Set([
  'ATL','DFW','DEN','ORD','LAX','JFK','SFO','SEA','LAS','MCO',
  'CLT','EWR','PHX','IAH','MIA','BOS','MSP','FLL','DTW','PHL',
  'LGA','BWI','SLC','DCA','SAN','IAD','TPA','AUS','HNL','MDW',
  'BNA','DAL','STL','HOU','RDU','SJC','SMF','IND','MCI','CLE',
  'SAT','PIT','PDX','MSY','RSW','CMH','SNA','BUF',
]);

// Common airport name aliases
const AIRPORT_ALIASES: Record<string, string> = {
  'lax': 'LAX', 'jfk': 'JFK', 'ohare': 'ORD', "o'hare": 'ORD',
  'laguardia': 'LGA', 'newark': 'EWR', 'midway': 'MDW',
  'dulles': 'IAD', 'reagan': 'DCA', 'national': 'DCA',
  'logan': 'BOS', 'hobby': 'HOU', 'love field': 'DAL',
  'sky harbor': 'PHX', 'hartsfield': 'ATL', 'atlanta': 'ATL',
  'denver': 'DEN', 'dia': 'DEN', 'sfo': 'SFO', 'sea-tac': 'SEA',
  'seatac': 'SEA', 'tampa': 'TPA', 'fort lauderdale': 'FLL',
  'miami': 'MIA', 'orlando': 'MCO', 'charlotte': 'CLT',
  'phoenix': 'PHX', 'houston': 'IAH', 'dallas': 'DFW',
  'nashville': 'BNA', 'minneapolis': 'MSP', 'detroit': 'DTW',
  'philly': 'PHL', 'philadelphia': 'PHL', 'san diego': 'SAN',
  'austin': 'AUS', 'portland': 'PDX', 'pittsburgh': 'PIT',
  'new orleans': 'MSY', 'salt lake': 'SLC', 'honolulu': 'HNL',
  'sacramento': 'SMF', 'san jose': 'SJC', 'buffalo': 'BUF',
  'cleveland': 'CLE', 'columbus': 'CMH', 'kansas city': 'MCI',
  'indianapolis': 'IND', 'san antonio': 'SAT', 'raleigh': 'RDU',
  'st louis': 'STL', 'bwi': 'BWI', 'baltimore': 'BWI',
};

// Search queries targeting TSA wait time tweets
const SEARCH_QUERIES = [
  'TSA line minutes -is:retweet',
  'TSA wait time airport -is:retweet',
  'security line airport minutes -is:retweet',
  'TSA precheck wait -is:retweet',
  '"TSA" "minutes" -is:retweet',
  'airport security took minutes -is:retweet',
];

interface ExtractedReport {
  airportCode: string;
  waitMinutes: number;
  tweetText: string;
  tweetId: string;
  tweetDate: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

/**
 * Extract airport code from tweet text
 */
function extractAirport(text: string): string | null {
  const upper = text.toUpperCase();

  // Direct IATA code match (3 uppercase letters that match known codes)
  const codeMatch = text.match(/\b([A-Z]{3})\b/g);
  if (codeMatch) {
    for (const code of codeMatch) {
      if (AIRPORT_CODES.has(code)) return code;
    }
  }

  // Check aliases
  const lower = text.toLowerCase();
  for (const [alias, code] of Object.entries(AIRPORT_ALIASES)) {
    if (lower.includes(alias)) return code;
  }

  return null;
}

/**
 * Extract wait time in minutes from tweet text
 */
function extractWaitTime(text: string): number | null {
  const lower = text.toLowerCase();

  // Patterns: "45 minutes", "45 min", "45 mins", "45m"
  const minPatterns = [
    /(\d+)\s*(?:minutes?|mins?|m)\b/i,
    /(?:took|waited|wait was|wait is|wait time|line was|line is)\s*(?:about|around|like|roughly)?\s*(\d+)/i,
    /(\d+)\s*(?:minute|min)\s*(?:wait|line|queue)/i,
  ];

  for (const pattern of minPatterns) {
    const match = text.match(pattern);
    if (match) {
      const mins = parseInt(match[1]);
      // Sanity check: 0-180 minutes is plausible for TSA
      if (mins > 0 && mins <= 180) return mins;
    }
  }

  // "hour" patterns: "1 hour", "an hour", "hour and a half"
  const hourMatch = lower.match(/(\d+\.?\d*)\s*(?:hours?|hrs?|h)\b/);
  if (hourMatch) {
    const hours = parseFloat(hourMatch[1]);
    if (hours > 0 && hours <= 3) return Math.round(hours * 60);
  }

  if (lower.includes('an hour') || lower.includes('1 hour')) return 60;
  if (lower.includes('hour and a half') || lower.includes('1.5 hour')) return 90;
  if (lower.includes('half hour') || lower.includes('half an hour')) return 30;
  if (lower.includes('2 hours')) return 120;

  return null;
}

/**
 * Basic sentiment analysis on TSA tweet
 */
function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lower = text.toLowerCase();

  const negativeWords = [
    'terrible', 'horrible', 'worst', 'nightmare', 'ridiculous', 'insane',
    'awful', 'unacceptable', 'hate', 'angry', 'frustrated', 'chaos',
    'disaster', 'packed', 'crazy', 'absurd', 'hell', 'forever',
    'unbelievable', 'slow', 'endless', 'brutal', 'painful',
  ];

  const positiveWords = [
    'quick', 'fast', 'breeze', 'smooth', 'easy', 'great', 'amazing',
    'no wait', 'no line', 'empty', 'flew through', 'impressed',
    'efficient', 'love', 'precheck worth', 'sailed through',
  ];

  const negScore = negativeWords.filter(w => lower.includes(w)).length;
  const posScore = positiveWords.filter(w => lower.includes(w)).length;

  if (negScore > posScore) return 'negative';
  if (posScore > negScore) return 'positive';
  return 'neutral';
}

/**
 * Search Twitter via SocialData API
 */
async function searchTweets(query: string): Promise<any[]> {
  const url = `https://api.socialdata.tools/twitter/search?query=${encodeURIComponent(query)}&type=Latest`;

  const resp = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${SOCIALDATA_KEY}`,
      'Accept': 'application/json',
    },
  });

  if (!resp.ok) {
    console.error(`Search failed (${resp.status}): ${await resp.text()}`);
    return [];
  }

  const data = await resp.json();
  return data.tweets || [];
}

/**
 * Process tweets into wait reports
 */
function processTweets(tweets: any[]): ExtractedReport[] {
  const reports: ExtractedReport[] = [];

  for (const tweet of tweets) {
    const text = tweet.full_text || tweet.text || '';
    const airport = extractAirport(text);
    const waitTime = extractWaitTime(text);

    if (airport && waitTime) {
      reports.push({
        airportCode: airport,
        waitMinutes: waitTime,
        tweetText: text.slice(0, 280),
        tweetId: tweet.id_str || tweet.id?.toString() || '',
        tweetDate: tweet.created_at || new Date().toISOString(),
        sentiment: analyzeSentiment(text),
      });
    }
  }

  return reports;
}

/**
 * Check if tweet was already ingested (dedup by tweet ID)
 */
async function isDuplicate(tweetId: string): Promise<boolean> {
  const { data } = await supabase
    .from('wait_reports')
    .select('id')
    .eq('ip_hash', `tweet:${tweetId}`)
    .limit(1);

  return (data?.length || 0) > 0;
}

/**
 * Insert reports into Supabase
 */
async function insertReports(reports: ExtractedReport[]): Promise<number> {
  let inserted = 0;

  for (const report of reports) {
    // Dedup check
    if (await isDuplicate(report.tweetId)) continue;

    // Find the default checkpoint for this airport (first non-precheck)
    const { data: checkpoints } = await supabase
      .from('checkpoints')
      .select('id')
      .eq('airport_code', report.airportCode)
      .eq('is_precheck', false)
      .limit(1);

    const checkpointId = checkpoints?.[0]?.id;
    if (!checkpointId) continue;

    const { error } = await supabase
      .from('wait_reports')
      .insert({
        airport_code: report.airportCode,
        checkpoint_id: checkpointId,
        wait_minutes: report.waitMinutes,
        ip_hash: `tweet:${report.tweetId}`, // Use ip_hash for dedup
        user_agent: `twitter:${report.sentiment}:${report.tweetText.slice(0, 100)}`,
      });

    if (error) {
      console.error(`Insert error for ${report.airportCode}:`, error.message);
    } else {
      inserted++;
      console.log(`  ✅ ${report.airportCode} — ${report.waitMinutes}min (${report.sentiment}) — "${report.tweetText.slice(0, 80)}..."`);
    }
  }

  return inserted;
}

/**
 * Main ingestion run
 */
async function run() {
  console.log(`\n🔍 TSA Tweet Ingestion — ${new Date().toISOString()}`);
  console.log('='.repeat(60));

  let totalTweets = 0;
  let totalReports: ExtractedReport[] = [];

  for (const query of SEARCH_QUERIES) {
    console.log(`\nSearching: "${query}"`);
    const tweets = await searchTweets(query);
    totalTweets += tweets.length;
    console.log(`  Found ${tweets.length} tweets`);

    const reports = processTweets(tweets);
    console.log(`  Extracted ${reports.length} valid reports`);
    totalReports.push(...reports);

    // Rate limit: 3 req/min on free tier
    await new Promise(r => setTimeout(r, 1500));
  }

  // Dedup within batch (same tweet from different queries)
  const seen = new Set<string>();
  const unique = totalReports.filter(r => {
    if (seen.has(r.tweetId)) return false;
    seen.add(r.tweetId);
    return true;
  });

  console.log(`\n📊 Summary: ${totalTweets} tweets scanned, ${unique.length} unique reports extracted`);

  if (unique.length > 0) {
    console.log('\nInserting reports...');
    const inserted = await insertReports(unique);
    console.log(`\n✅ Inserted ${inserted} new reports into Supabase`);

    // Log sentiment breakdown
    const sentiments = { positive: 0, negative: 0, neutral: 0 };
    unique.forEach(r => sentiments[r.sentiment]++);
    console.log(`📈 Sentiment: ${sentiments.positive} positive, ${sentiments.neutral} neutral, ${sentiments.negative} negative`);
  } else {
    console.log('\nNo new reports to insert.');
  }
}

run().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
