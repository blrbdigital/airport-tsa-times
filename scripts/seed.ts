// Run: npx tsx scripts/seed.ts
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Import airport data
import { airports } from '../src/data/airports.js';

async function seed() {
  console.log('Seeding airports...');

  // Insert airports
  const airportRows = airports.map(a => ({
    id: a.id,
    code: a.code,
    name: a.name,
    city: a.city,
    state: a.state,
    lat: a.lat,
    lng: a.lng,
  }));

  const { error: airportError } = await supabase.from('airports').upsert(airportRows);
  if (airportError) {
    console.error('Airport insert error:', airportError);
    return;
  }
  console.log(`✅ ${airportRows.length} airports inserted`);

  // Insert checkpoints
  const checkpointRows = airports.flatMap(a =>
    a.checkpoints.map(cp => ({
      id: cp.id,
      airport_id: a.id,
      airport_code: a.code,
      name: cp.name,
      terminal: cp.terminal,
      is_precheck: cp.isPrecheck,
    }))
  );

  const { error: cpError } = await supabase.from('checkpoints').upsert(checkpointRows);
  if (cpError) {
    console.error('Checkpoint insert error:', cpError);
    return;
  }
  console.log(`✅ ${checkpointRows.length} checkpoints inserted`);

  // Seed some demo wait reports so the site isn't empty
  console.log('Seeding demo reports...');
  const reports: any[] = [];
  const now = new Date();

  for (const airport of airports.slice(0, 30)) {
    for (const cp of airport.checkpoints) {
      const count = 3 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        const minutesAgo = Math.floor(Math.random() * 240);
        const baseWait = cp.isPrecheck ? 7 : 20;
        const variance = cp.isPrecheck ? 8 : 20;
        const waitMinutes = Math.max(2, Math.round(baseWait + (Math.random() - 0.5) * variance));

        reports.push({
          airport_code: airport.code,
          checkpoint_id: cp.id,
          wait_minutes: waitMinutes,
          reported_at: new Date(now.getTime() - minutesAgo * 60000).toISOString(),
          ip_hash: `seed-${i}`,
        });
      }
    }
  }

  const batchSize = 100;
  for (let i = 0; i < reports.length; i += batchSize) {
    const batch = reports.slice(i, i + batchSize);
    const { error } = await supabase.from('wait_reports').insert(batch);
    if (error) {
      console.error(`Report batch error at ${i}:`, error);
      return;
    }
  }
  console.log(`✅ ${reports.length} demo reports seeded`);

  console.log('\nDone! Database is ready.');
}

seed().catch(console.error);
