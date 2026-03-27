import { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import AirportCard from '../components/AirportCard';
import LiveFeed from '../components/LiveFeed';
import { generateAirportSummaries, generateLiveReports } from '../data/mockData';
import { searchAirports } from '../data/airports';
import type { AirportWaitSummary } from '../lib/types';

type SortMode = 'wait-asc' | 'wait-desc' | 'alpha' | 'reports';

export default function Home() {
  const [sortMode, setSortMode] = useState<SortMode>('wait-desc');
  const [filterQuery, setFilterQuery] = useState('');

  // In production, these come from Supabase real-time
  const summaries = useMemo(() => generateAirportSummaries(), []);
  const liveReports = useMemo(() => generateLiveReports(15), []);

  const totalReports = summaries.reduce((sum, a) => sum + a.reportCount, 0);

  // Filter
  const filteredCodes = filterQuery
    ? new Set(searchAirports(filterQuery).map(a => a.code))
    : null;

  const filtered = filteredCodes
    ? summaries.filter(s => filteredCodes.has(s.code))
    : summaries;

  // Sort
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
      {/* Hero section */}
      <div className="mb-8">
        <div className="flex flex-col items-center text-center mb-6">
          <h1 className="board-text text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
            How long is TSA<span className="text-amber">?</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-md">
            Real-time security wait times reported by travelers. Check before you fly, report after you clear.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-4">
          <SearchBar large />
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-wait-green live-pulse" />
            <span className="board-text">{totalReports}</span> reports today
          </span>
          <span>
            <span className="board-text">{summaries.length}</span> airports
          </span>
          <span className="hidden sm:inline">
            Updated in real-time
          </span>
        </div>
      </div>

      {/* Main grid + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Airport grid */}
        <div className="lg:col-span-2">
          {/* Sort controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Filter..."
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                className="bg-terminal-card border border-terminal-border rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber/30 w-32 sm:w-40"
              />
              <span className="text-xs text-slate-500 board-text">
                {sorted.length} airport{sorted.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {[
                { key: 'wait-desc' as SortMode, label: 'Longest' },
                { key: 'wait-asc' as SortMode, label: 'Shortest' },
                { key: 'reports' as SortMode, label: 'Active' },
                { key: 'alpha' as SortMode, label: 'A-Z' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortMode(opt.key)}
                  className={`px-2 py-1 rounded text-[11px] transition-colors ${
                    sortMode === opt.key
                      ? 'bg-terminal-card-hover text-slate-200 border border-terminal-border-light'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Airport cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sorted.map((airport, i) => (
              <AirportCard key={airport.code} airport={airport} index={i} />
            ))}
          </div>

          {sorted.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500 text-sm">No airports match your search.</p>
            </div>
          )}
        </div>

        {/* Sidebar — live feed */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <LiveFeed reports={liveReports} />

            {/* Quick stats */}
            <div className="mt-6 p-4 rounded-xl bg-terminal-card border border-terminal-border">
              <h3 className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Right Now</h3>
              <div className="space-y-3">
                <QuickStat
                  label="Longest wait"
                  airport={sorted[0]}
                />
                <QuickStat
                  label="Shortest wait"
                  airport={[...sorted].sort((a, b) => a.avgWait - b.avgWait)[0]}
                />
                <QuickStat
                  label="Most reports"
                  airport={[...sorted].sort((a, b) => b.reportCount - a.reportCount)[0]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ label, airport }: { label: string; airport?: AirportWaitSummary }) {
  if (!airport) return null;

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[11px] text-slate-500">{label}</p>
        <p className="text-sm text-slate-300">
          <span className="board-text text-amber font-medium">{airport.code}</span>
          <span className="text-slate-500 ml-1.5">{airport.city}</span>
        </p>
      </div>
      <span className="board-text text-sm font-bold text-slate-200">{airport.avgWait}m</span>
    </div>
  );
}
