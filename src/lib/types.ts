export interface Airport {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  checkpoints: Checkpoint[];
}

export interface Checkpoint {
  id: string;
  airportCode: string;
  name: string;
  terminal: string;
  isPrecheck: boolean;
}

export interface WaitReport {
  id: string;
  airportCode: string;
  checkpointId: string;
  checkpointName: string;
  waitMinutes: number;
  reportedAt: string;
  terminal: string;
  sourceType: 'user' | 'twitter';
  sourceText?: string;
  sourceUrl?: string;
}

export interface AirportWaitSummary {
  code: string;
  name: string;
  city: string;
  state: string;
  avgWait: number;
  minWait: number;
  maxWait: number;
  reportCount: number;
  lastReport: string | null;
  checkpoints: CheckpointWait[];
}

export interface CheckpointWait {
  id: string;
  name: string;
  terminal: string;
  isPrecheck: boolean;
  avgWait: number;
  reportCount: number;
  lastReport: string | null;
  trend: 'up' | 'down' | 'stable';
}

export interface HourlyData {
  hour: number;
  avgWait: number;
  reportCount: number;
}

export type WaitLevel = 'low' | 'medium' | 'high';

export function getWaitLevel(minutes: number): WaitLevel {
  if (minutes <= 15) return 'low';
  if (minutes <= 30) return 'medium';
  return 'high';
}

export function getWaitColor(level: WaitLevel): string {
  switch (level) {
    case 'low': return 'text-wait-green';
    case 'medium': return 'text-wait-amber';
    case 'high': return 'text-wait-red';
  }
}

export function getWaitBg(level: WaitLevel): string {
  switch (level) {
    case 'low': return 'bg-wait-green-bg border-wait-green/20';
    case 'medium': return 'bg-wait-amber-bg border-wait-amber/20';
    case 'high': return 'bg-wait-red-bg border-wait-red/20';
  }
}

export function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}
