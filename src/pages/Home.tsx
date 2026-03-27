import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import AirportCard from '../components/AirportCard';
import LiveFeed from '../components/LiveFeed';
import { useAirportSummaries, useLiveReports } from '../hooks/useWaitTimes';
import { searchAirports } from '../data/airports';
import { getWaitLevel, getWaitColor } from '../lib/types';
import type { AirportWaitSummary } from '../lib/types';

type SortMode = 'wait-desc' | 'wait-asc' | 'alpha' | 'reports';

export default function Home() {
  const [sortMode, setSortMode] = useState<SortMode>('wait-desc');
  const [filterQuery, setFilterQuery] = useState('');
  const [showFeed, setShowFeed] = useState(false);

  const { summaries, loading } = useAirportSummaries();
  const { reports: liveReports } = useLiveReports();

  const totalReports = summaries.reduce((sum, a) => sum + a.reportCount, 0);
  const twitterReportCount = liveReports.filter(r => r.sourceType === 'twitter').length;

  const filteredCodes = filterQuery
    ? new Set(searchAirports(filterQuery).map(a => a.code))
    : null;

  const filtered = filteredCodes
    ? summaries.filter(s => filteredCodes.has(s.code))
    : summaries;

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortMode) {
      case 'wait-desc':
        return arr.sort((a, b) => b.avgWait - a.avgWait);
      case 'wait-asc':
        return arr.sort((a, b) => a.avgWait - b.avgWait);
      case 'alpha':
        return arr.sort((a, b) => a.code.localeCompare(b.code));
      case 'reports':
        return arr.sort((a, b) => b.reportCount - a.reportCount);
    }
  }, [filtered, sortMode]);

  // Top 3 for mobile quick glance
  const hotAirports = useMemo(() =>
    [...summaries].filter(a => a.reportCount > 0).sort((a, b) => b.avgWait - a.avgWait).slice(0, 3),
    [summaries]
  );

  return (
    <div>
      {/* Hero — tighter on mobile */}
      <div className="mb-6 sm:mb-10">
        <div className="text-center mb-5 sm:mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-ink tracking-tight mb-1.5 sm:mb-2">
            How long is TSA<span className="text-coral">?</span>
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto">
            Real-time security wait times from real travelers.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-4 sm:mb-5">
          <SearchBar large />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-wait-green live-dot" />
            <span className="mono font-medium">{totalReports}</span> reports
          </span>
          <span className="text-border">|</span>
          <span>
            <span className="mono font-medium">{summaries.length}</span> airports
          </span>
          <span className="hidden sm:inline text-border">|</span>
          <span className="hidden sm:inline">Updated in real-time</span>
        </div>

        {/* X Analysis trust banner */}
        {twitterReportCount > 0 && (
          <div className="mt-4 sm:mt-5 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface border border-border-light/60 shadow-sm">
              <svg className="w-3.5 h-3.5 text-ink-muted flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-[11px] sm:text-xs text-ink-muted">
                Analyzing real-time tweets for wait time data
                <span className="text-ink-faint mx-1.5">&middot;</span>
                <span className="mono font-medium text-ink">{twitterReportCount}</span> tweet{twitterReportCount !== 1 ? 's' : ''} tracked
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Hot airports strip */}
      {!loading && hotAirports.length > 0 && (
        <div className="sm:hidden mb-5">
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <span className="text-xs font-semibold text-ink">Longest waits right now</span>
            <button
              onClick={() => setShowFeed(!showFeed)}
              className="text-[11px] text-coral font-medium"
            >
              {showFeed ? 'Hide feed' : 'Live feed'}
            </button>
          </div>

          {showFeed ? (
            <div className="bg-surface rounded-2xl border border-border-light p-3 mb-4 animate-fade-in">
              <LiveFeed reports={liveReports} maxItems={5} />
            </div>
          ) : (
            <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory">
              {hotAirports.map(a => {
                const level = getWaitLevel(a.avgWait);
                const color = getWaitColor(level);
                return (
                  <Link
                    key={a.code}
                    to={`/airport/${a.code.toLowerCase()}`}
                    className="flex-shrink-0 snap-start bg-surface rounded-xl border border-border-light p-3.5 w-[120px] shadow-sm"
                  >
                    <div className="mono text-base font-bold text-ink">{a.code}</div>
                    <div className={`mono text-2xl font-bold ${color} mt-0.5`}>
                      {a.avgWait}<span className="text-xs opacity-60">m</span>
                    </div>
                    <div className="text-[10px] text-ink-faint mt-1 truncate">{a.city}</div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 sm:py-20">
          <div className="inline-block w-6 h-6 border-2 border-coral/30 border-t-coral rounded-full animate-spin" />
          <p className="text-sm text-ink-muted mt-3">Loading airports...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            {/* Controls — scrollable sort on mobile */}
            <div className="flex items-center justify-between mb-4 sm:mb-5 gap-3">
              <input
                type="text"
                placeholder="Filter..."
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                className="bg-surface border border-border-light rounded-lg px-3 py-2 text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-coral/30 w-24 sm:w-36 shadow-sm flex-shrink-0"
              />

              <div className="flex items-center gap-1 overflow-x-auto flex-shrink min-w-0 bg-surface border border-border-light rounded-lg p-0.5 shadow-sm">
                {[
                  { key: 'wait-desc' as SortMode, label: 'Longest' },
                  { key: 'wait-asc' as SortMode, label: 'Shortest' },
                  { key: 'reports' as SortMode, label: 'Active' },
                  { key: 'alpha' as SortMode, label: 'A-Z' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setSortMode(opt.key)}
                    className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      sortMode === opt.key
                        ? 'bg-coral text-white shadow-sm'
                        : 'text-ink-muted active:bg-cream-dark'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Airport list (mobile) / grid (desktop) */}
            <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-2 sm:gap-3">
              {sorted.map((airport, i) => (
                <AirportCard key={airport.code} airport={airport} index={i} />
              ))}
            </div>

            {sorted.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <p className="text-ink-muted text-sm">No airports match your search.</p>
              </div>
            )}
          </div>

          {/* Desktop sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <div className="bg-surface border border-border-light rounded-2xl p-4 shadow-sm">
                <LiveFeed reports={liveReports} />
              </div>

              <div className="bg-surface border border-border-light rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs text-ink-faint mb-4 mono uppercase tracking-wider">Right Now</h3>
                <div className="space-y-4">
                  <QuickStat label="Longest wait" airport={sorted[0]} />
                  <QuickStat label="Shortest wait" airport={[...sorted].sort((a, b) => a.avgWait - b.avgWait)[0]} />
                  <QuickStat label="Most reports" airport={[...sorted].sort((a, b) => b.reportCount - a.reportCount)[0]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickStat({ label, airport }: { label: string; airport?: AirportWaitSummary }) {
  if (!airport) return null;

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[11px] text-ink-faint mb-0.5">{label}</p>
        <p className="text-sm text-ink">
          <span className="mono text-coral font-semibold">{airport.code}</span>
          <span className="text-ink-muted ml-1.5">{airport.city}</span>
        </p>
      </div>
      <span className="mono text-sm font-bold text-ink">{airport.avgWait}m</span>
    </div>
  );
}
