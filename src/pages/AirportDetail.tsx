import { useParams, Link } from 'react-router-dom';
import { getAirport } from '../data/airports';
import { useAirportSummaries, useLiveReports, useHourlyData } from '../hooks/useWaitTimes';
import { getWaitLevel, getWaitColor, formatTimeAgo } from '../lib/types';
import WaitTimeBadge from '../components/WaitTimeBadge';
import CheckpointList from '../components/CheckpointList';
import TrendChart from '../components/TrendChart';
import LiveFeed from '../components/LiveFeed';

export default function AirportDetail() {
  const { code } = useParams<{ code: string }>();
  const airport = getAirport(code || '');
  const { summaries, loading } = useAirportSummaries();
  const summary = summaries.find(s => s.code.toLowerCase() === code?.toLowerCase());
  const { data: hourlyData } = useHourlyData(code?.toUpperCase() || '');
  const { reports: recentReports } = useLiveReports(code?.toUpperCase());

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-6 h-6 border-2 border-coral/30 border-t-coral rounded-full animate-spin" />
        <p className="text-sm text-ink-muted mt-3">Loading...</p>
      </div>
    );
  }

  if (!airport || !summary) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl font-bold text-ink-muted mb-2">Airport not found</p>
        <p className="text-sm text-ink-faint mb-6">
          We don't have data for "{code?.toUpperCase()}" yet.
        </p>
        <Link to="/" className="text-coral hover:text-coral-dark text-sm font-medium">
          &larr; Back to all airports
        </Link>
      </div>
    );
  }

  const level = getWaitLevel(summary.avgWait);
  const color = getWaitColor(level);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <Link to="/" className="text-xs text-ink-muted hover:text-ink transition-colors mb-5 inline-flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All Airports
      </Link>

      {/* Header card */}
      <div className="bg-surface border border-border-light rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="mono text-4xl sm:text-5xl font-bold text-ink tracking-tight">
                {airport.code}
              </h1>
              <span className={`w-3 h-3 rounded-full ${
                level === 'low' ? 'bg-wait-green' : level === 'medium' ? 'bg-wait-amber' : 'bg-wait-red'
              } ${level === 'high' ? 'live-dot' : ''}`} />
            </div>
            <p className="text-ink-light font-medium">{airport.name}</p>
            <p className="text-sm text-ink-muted mt-0.5">{airport.city}, {airport.state}</p>
          </div>

          <div className="flex items-center gap-5">
            <WaitTimeBadge minutes={summary.avgWait} size="xl" />
            <Link
              to={`/report?airport=${airport.code}`}
              className="px-5 py-3 rounded-full bg-coral text-white font-semibold text-sm hover:bg-coral-dark transition-colors shadow-sm"
            >
              Report Time
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-7 pt-6 border-t border-border-light">
          <StatBox label="Avg Wait" value={`${summary.avgWait}m`} color={color} />
          <StatBox label="Shortest" value={`${summary.minWait}m`} color="text-wait-green" />
          <StatBox label="Longest" value={`${summary.maxWait}m`} color="text-wait-red" />
          <StatBox
            label="Reports"
            value={summary.reportCount.toString()}
            color="text-ink"
            sub={summary.lastReport ? formatTimeAgo(summary.lastReport) : undefined}
          />
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CheckpointList checkpoints={summary.checkpoints} />

          {hourlyData.length > 0 && (
            <div className="bg-surface border border-border-light rounded-2xl p-5 shadow-sm">
              <TrendChart data={hourlyData} />
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            <div className="bg-surface border border-border-light rounded-2xl p-4 shadow-sm">
              <LiveFeed reports={recentReports} maxItems={10} />
            </div>

            {/* Tips */}
            <div className="bg-surface border border-border-light rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs text-ink-faint mb-3 mono uppercase tracking-wider">Pro Tips</h3>
              <div className="space-y-3 text-xs text-ink-muted leading-relaxed">
                <p>Early flights (5-6am) typically have the shortest lines.</p>
                <p>TSA PreCheck averages 5-10 min — worth the $78/5yr investment.</p>
                <p>Check back 2 hours before your flight for the freshest data.</p>
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
      <p className="text-[11px] text-ink-faint mb-1 mono uppercase tracking-wider">{label}</p>
      <p className={`mono text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-[10px] text-ink-faint mt-0.5">{sub}</p>}
    </div>
  );
}
