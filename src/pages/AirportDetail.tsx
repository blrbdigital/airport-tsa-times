import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { getAirport } from '../data/airports';
import { generateAirportSummaries, generateHourlyData, generateLiveReports } from '../data/mockData';
import { getWaitLevel, getWaitColor, formatTimeAgo } from '../lib/types';
import WaitTimeBadge from '../components/WaitTimeBadge';
import CheckpointList from '../components/CheckpointList';
import TrendChart from '../components/TrendChart';
import LiveFeed from '../components/LiveFeed';

export default function AirportDetail() {
  const { code } = useParams<{ code: string }>();
  const airport = getAirport(code || '');
  const summaries = useMemo(() => generateAirportSummaries(), []);
  const summary = summaries.find(s => s.code.toLowerCase() === code?.toLowerCase());
  const hourlyData = useMemo(() => generateHourlyData(), []);
  const recentReports = useMemo(
    () => generateLiveReports(30).filter(r => r.airportCode.toLowerCase() === code?.toLowerCase()),
    [code]
  );

  if (!airport || !summary) {
    return (
      <div className="text-center py-20">
        <p className="board-text text-2xl text-slate-400 mb-2">Airport not found</p>
        <p className="text-sm text-slate-500 mb-6">
          We don't have data for "{code?.toUpperCase()}" yet.
        </p>
        <Link to="/" className="text-amber hover:text-amber/80 text-sm">
          ← Back to all airports
        </Link>
      </div>
    );
  }

  const level = getWaitLevel(summary.avgWait);
  const color = getWaitColor(level);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-4 inline-block">
        ← All Airports
      </Link>

      {/* Header */}
      <div className="bg-terminal-card border border-terminal-border rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="board-text text-3xl sm:text-4xl font-bold text-slate-100">
                {airport.code}
              </h1>
              <span className={`w-3 h-3 rounded-full ${
                level === 'low' ? 'bg-wait-green' : level === 'medium' ? 'bg-wait-yellow' : 'bg-wait-red'
              } ${level === 'high' ? 'live-pulse' : ''}`} />
            </div>
            <p className="text-slate-400">{airport.name}</p>
            <p className="text-sm text-slate-500 mt-0.5">{airport.city}, {airport.state}</p>
          </div>

          <div className="flex items-center gap-6">
            <WaitTimeBadge minutes={summary.avgWait} size="xl" />
            <Link
              to={`/report?airport=${airport.code}`}
              className="px-5 py-3 rounded-xl bg-amber text-terminal-bg font-semibold text-sm hover:bg-amber/90 transition-colors board-text"
            >
              Report Time
            </Link>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-terminal-border">
          <StatBox label="Avg Wait" value={`${summary.avgWait}m`} color={color} />
          <StatBox label="Shortest" value={`${summary.minWait}m`} color="text-wait-green" />
          <StatBox label="Longest" value={`${summary.maxWait}m`} color="text-wait-red" />
          <StatBox
            label="Reports"
            value={summary.reportCount.toString()}
            color="text-slate-200"
            sub={summary.lastReport ? formatTimeAgo(summary.lastReport) : undefined}
          />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Checkpoints + Trend */}
        <div className="lg:col-span-2 space-y-6">
          <CheckpointList checkpoints={summary.checkpoints} />
          <div className="bg-terminal-card border border-terminal-border rounded-xl p-4">
            <TrendChart data={hourlyData} />
          </div>
        </div>

        {/* Right: Recent reports */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <LiveFeed reports={recentReports} maxItems={10} />

            {/* Tips */}
            <div className="mt-6 p-4 rounded-xl bg-terminal-card border border-terminal-border">
              <h3 className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Pro Tips</h3>
              <div className="space-y-2.5 text-xs text-slate-400">
                <p>🕐 Earliest flights (5-6am) often have the shortest lines.</p>
                <p>⚡ TSA PreCheck averages 5-10 min — worth the $78/5yr.</p>
                <p>📱 Check back 2 hours before your flight for the freshest data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  return (
    <div>
      <p className="text-[11px] text-slate-500 mb-1">{label}</p>
      <p className={`board-text text-lg font-bold ${color}`}>{value}</p>
      {sub && <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>}
    </div>
  );
}
