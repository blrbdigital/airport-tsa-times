import { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import AirportCard from '../components/AirportCard';
import LiveFeed from '../components/LiveFeed';
import { useAirportSummaries, useLiveReports } from '../hooks/useWaitTimes';
import { searchAirports } from '../data/airports';
import type { AirportWaitSummary } from '../lib/types';

type SortMode = 'wait-asc' | 'wait-desc' | 'alpha' | 'reports';

export default function Home() {
  const [sortMode, setSortMode] = useState<SortMode>('wait-desc');
  const [filterQuery, setFilterQuery] = useState('');

  const { summaries, loading } = useAirportSummaries();
  const { reports: liveReports } = useLiveReports();

  const totalReports = summaries.reduce((sum, a) => sum + a.reportCount, 0);

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

  return (
    <div>
      {/* Hero */}
      <div className="mb-10">
        <div className="flex flex-col items-center text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight mb-2">
            How long is TSA<span className="text-coral">?</span>
          </h1>
          <p className="text-sm text-ink-muted max-w-md leading-relaxed">
            Real-time security wait times reported by travelers. Check before you fly, report after you clear.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-5">
          <SearchBar large />
        </div>

        {/* Stats ticker */}
        <div className="flex items-center justify-center gap-6 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-wait-green live-dot" />
            <span className="mono font-medium">{totalReports}</span> reports today
          </span>
          <span className="hidden sm:inline text-border">|</span>
          <span>
            <span className="mono font-medium">{summaries.length}</span> airports
          </span>
          <span className="hidden sm:inline text-border">|</span>
          <span className="hidden sm:inline">
            Updated in real-time
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-6 h-6 border-2 border-coral/30 border-t-coral rounded-full animate-spin" />
          <p className="text-sm text-ink-muted mt-3">Loading airports...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Airport grid */}
          <div className="lg:col-span-2">
            {/* Controls bar */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Filter..."
                  value={filterQuery}
                  onChange={e => setFilterQuery(e.target.value)}
                  className="bg-surface border border-border-light rounded-lg px-3 py-1.5 text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-coral/30 w-28 sm:w-36 shadow-sm"
                />
                <span className="text-xs text-ink-faint mono">
                  {sorted.length} airport{sorted.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-surface border border-border-light rounded-lg p-0.5 shadow-sm">
                {[
                  { key: 'wait-desc' as SortMode, label: 'Longest' },
                  { key: 'wait-asc' as SortMode, label: 'Shortest' },
                  { key: 'reports' as SortMode, label: 'Active' },
                  { key: 'alpha' as SortMode, label: 'A-Z' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setSortMode(opt.key)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      sortMode === opt.key
                        ? 'bg-coral text-white shadow-sm'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sorted.map((airport, i) => (
                <AirportCard key={airport.code} airport={airport} index={i} />
              ))}
            </div>

            {sorted.length === 0 && (
              <div className="text-center py-16">
                <p className="text-ink-muted text-sm">No airports match your search.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
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
