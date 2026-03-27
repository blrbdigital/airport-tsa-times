import type { WaitReport, AirportWaitSummary, HourlyData } from '../lib/types';
import { airports } from './airports';

// Generate realistic mock wait time data
function randomWait(base: number, variance: number): number {
  return Math.max(2, Math.round(base + (Math.random() - 0.5) * variance));
}

function randomMinutesAgo(maxMinutes: number): string {
  const ms = Math.floor(Math.random() * maxMinutes * 60000);
  return new Date(Date.now() - ms).toISOString();
}

const reporterPhrases = [
  'Smooth sailing today',
  'Not bad for a Monday',
  'Packed!',
  'PreCheck was worth it',
  'Bring snacks',
  'Moved faster than expected',
  'Had to take off shoes AND belt',
  'Longest line I\'ve seen here',
];

// Generate recent reports for the live feed
export function generateLiveReports(count: number = 20): WaitReport[] {
  const reports: WaitReport[] = [];
  for (let i = 0; i < count; i++) {
    const airport = airports[Math.floor(Math.random() * airports.length)];
    const checkpoint = airport.checkpoints[Math.floor(Math.random() * airport.checkpoints.length)];
    const baseWait = checkpoint.isPrecheck ? 8 : 22;
    reports.push({
      id: `mock-${i}`,
      airportCode: airport.code,
      checkpointId: checkpoint.id,
      checkpointName: checkpoint.name,
      waitMinutes: randomWait(baseWait, checkpoint.isPrecheck ? 10 : 25),
      reportedAt: randomMinutesAgo(180),
      terminal: checkpoint.terminal,
    });
  }
  return reports.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
}

// Generate airport wait summaries
export function generateAirportSummaries(): AirportWaitSummary[] {
  return airports.map(airport => {
    const checkpoints = airport.checkpoints.map(cp => {
      const baseWait = cp.isPrecheck ? 7 : 20;
      const variance = cp.isPrecheck ? 6 : 18;
      const avgWait = randomWait(baseWait, variance);
      return {
        id: cp.id,
        name: cp.name,
        terminal: cp.terminal,
        isPrecheck: cp.isPrecheck,
        avgWait,
        reportCount: Math.floor(Math.random() * 15) + 1,
        lastReport: randomMinutesAgo(120),
        trend: (['up', 'down', 'stable'] as const)[Math.floor(Math.random() * 3)],
      };
    });

    const nonPrecheck = checkpoints.filter(c => !c.isPrecheck);
    const avgWait = nonPrecheck.length > 0
      ? Math.round(nonPrecheck.reduce((sum, c) => sum + c.avgWait, 0) / nonPrecheck.length)
      : 0;

    return {
      code: airport.code,
      name: airport.name,
      city: airport.city,
      state: airport.state,
      avgWait,
      minWait: Math.min(...checkpoints.map(c => c.avgWait)),
      maxWait: Math.max(...checkpoints.map(c => c.avgWait)),
      reportCount: checkpoints.reduce((sum, c) => sum + c.reportCount, 0),
      lastReport: checkpoints.reduce((latest, c) =>
        !latest || (c.lastReport && new Date(c.lastReport) > new Date(latest)) ? c.lastReport : latest,
        null as string | null
      ),
      checkpoints,
    };
  });
}

// Generate hourly trend data for a specific airport
export function generateHourlyData(): HourlyData[] {
  const hours: HourlyData[] = [];
  for (let h = 4; h <= 23; h++) {
    // Realistic pattern: peaks at 6-8am and 4-6pm
    let baseWait = 15;
    if (h >= 5 && h <= 8) baseWait = 30 + (h - 5) * 5;
    if (h >= 9 && h <= 11) baseWait = 25;
    if (h >= 12 && h <= 14) baseWait = 18;
    if (h >= 15 && h <= 18) baseWait = 28 + (h === 17 ? 8 : 0);
    if (h >= 19) baseWait = 15 - (h - 19) * 2;

    hours.push({
      hour: h,
      avgWait: randomWait(baseWait, 8),
      reportCount: Math.floor(Math.random() * 20) + (h >= 6 && h <= 20 ? 10 : 2),
    });
  }
  return hours;
}

export { reporterPhrases };
