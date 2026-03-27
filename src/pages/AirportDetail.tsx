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

  const twitterCount = recentReports.filter(r => r.sourceType === 'twitter').length;

  if (loading) {
    return (
      <div className="text-center py-16 sm:py-20">
        <div className="inline-block w-6 h-6 border-2 border-coral/30 border-t-coral rounded-full animate-spin" />
        <p className="text-sm text-ink-muted mt-3">Loading...</p>
      </div>
    );
  }

  if (!airport || !summary) {
    return (
      <div className="text-center py-16 sm:py-20">
        <p className="text-xl sm:text-2xl font-bold text-ink-muted mb-2">Airport not found</p>
        <p className="text-sm text-ink-faint mb-6">
          No data for "{code?.toUpperCase()}" yet.
        </p>
        <Link to="/" className="text-coral active:text-coral-dark text-sm font-medium">
          &larr; Back to all airports
        </Link>
      </div>
    );
  }

  const level = getWaitLevel(summary.avgWait);
  const color = getWaitColor(level);

  return (
    <div className="animate-fade-in">
      <Link to="/" className="text-xs text-ink-muted active:text-ink transition-colors mb-4 sm:mb-5 inline-flex items-center gap-1 py-1">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All Airports
      </Link>

      {/* Header card */}
      <div className="bg-surface border border-border-light rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-5 sm:mb-0">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="mono text-3xl sm:text-5xl font-bold text-ink tracking-tight">
                {airport.code}
              </h1>
              <span className={`w-2.5 h-2.5 rounded-full ${
                level === 'low' ? 'bg-wait-green' : level === 'medium' ? 'bg-wait-amber' : 'bg-wait-red'
              } ${level === 'high' ? 'live-dot' : ''}`} />
            </div>
            <p className="text-ink-light font-medium text-sm sm:text-base">{airport.name}</p>
            <p className="text-xs sm:text-sm text-ink-muted mt-0.5">{airport.city}, {airport.state}</p>
          </div>

          <WaitTimeBadge minutes={summary.avgWait} size="lg" className="flex-shrink-0" />
        </div>

        <Link
          to={`/report?airport=${airport.code}`}
          className="block sm:inline-block w-full sm:w-auto text-center px-5 py-3 rounded-full bg-coral text-white font-semibold text-sm active:bg-coral-dark transition-colors shadow-sm mb-5 sm:mb-6"
        >
          Report Wait Time
        </Link>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-border-light">
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

      {/* Desktop: 2-column layout */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-8">
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
              <LiveFeed reports={recentReports} maxItems={10} expandTweets />
            </div>
            <div className="bg-surface border border-border-light rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs text-ink-faint mb-3 mono uppercase tracking-wider">Pro Tips</h3>
              <div className="space-y-2.5 text-xs text-ink-muted leading-relaxed">
                <p>Early flights (5-6am) typically have the shortest lines.</p>
                <p>TSA PreCheck averages 5-10 min — worth the $78/5yr.</p>
                <p>Check back 2hr before your flight for fresh data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: stacked layout with live feed right after checkpoints */}
      <div className="lg:hidden space-y-5">
        <CheckpointList checkpoints={summary.checkpoints} />

        {/* Live feed — prominent on mobile */}
        <div className="bg-surface border border-border-light rounded-2xl p-4 shadow-sm">
          <LiveFeed reports={recentReports} maxItems={8} expandTweets />

          {/* Source trust line */}
          {twitterCount > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-light">
              <svg className="w-3 h-3 text-ink-faint flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-[11px] text-ink-faint">
                {twitterCount} report{twitterCount !== 1 ? 's' : ''} sourced from X
              </span>
            </div>
          )}
        </div>

        {/* Trend chart */}
        {hourlyData.length > 0 && (
          <div className="bg-surface border border-border-light rounded-2xl p-4 shadow-sm">
            <TrendChart data={hourlyData} />
          </div>
        )}

        {/* Tips */}
        <div className="bg-surface border border-border-light rounded-2xl p-4 shadow-sm">
          <h3 className="text-xs text-ink-faint mb-3 mono uppercase tracking-wider">Pro Tips</h3>
          <div className="space-y-2.5 text-xs text-ink-muted leading-relaxed">
            <p>Early flights (5-6am) typically have the shortest lines.</p>
            <p>TSA PreCheck averages 5-10 min — worth the $78/5yr.</p>
            <p>Check back 2hr before your flight for fresh data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  return (
    <div>
      <p className="text-[10px] sm:text-[11px] text-ink-faint mb-0.5 mono uppercase tracking-wider">{label}</p>
      <p className={`mono text-lg sm:text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-[10px] text-ink-faint mt-0.5">{sub}</p>}
    </div>
  );
}
