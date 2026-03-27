import { Link } from 'react-router-dom';
import { getWaitLevel, getWaitColor, formatTimeAgo } from '../lib/types';
import type { AirportWaitSummary } from '../lib/types';

interface AirportCardProps {
  airport: AirportWaitSummary;
  index: number;
}

export default function AirportCard({ airport, index }: AirportCardProps) {
  const level = getWaitLevel(airport.avgWait);
  const color = getWaitColor(level);
  const hasData = airport.reportCount > 0;

  const dotColor = {
    low: 'bg-wait-green',
    medium: 'bg-wait-amber',
    high: 'bg-wait-red',
  }[level];

  const bgAccent = {
    low: 'bg-wait-green-bg',
    medium: 'bg-wait-amber-bg',
    high: 'bg-wait-red-bg',
  }[level];

  return (
    <Link
      to={`/airport/${airport.code.toLowerCase()}`}
      className="block bg-surface rounded-xl border border-border-light active:bg-surface-hover transition-colors shadow-sm animate-slide-up"
      style={{ animationDelay: `${Math.min(index * 25, 250)}ms`, animationFillMode: 'backwards' }}
    >
      {/* Mobile: clean single row */}
      <div className="sm:hidden">
        <div className="flex items-center px-4 py-3.5 gap-3">
          {/* Code + city */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="mono text-base font-bold text-ink w-10 flex-shrink-0">{airport.code}</span>
            {hasData && (
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor} ${level === 'high' ? 'live-dot' : ''}`} />
            )}
            <span className="text-sm text-ink-muted truncate">{airport.city}</span>
          </div>

          {/* Wait time badge */}
          {hasData ? (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${bgAccent} flex-shrink-0`}>
              <span className={`mono text-lg font-bold ${color}`}>{airport.avgWait}</span>
              <span className={`mono text-[11px] ${color} opacity-70`}>min</span>
            </div>
          ) : (
            <span className="text-sm text-ink-faint mono px-2.5">--</span>
          )}

          {/* Chevron */}
          <svg className="w-4 h-4 text-ink-faint flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Subtle bottom info */}
        {hasData && (
          <div className="flex items-center gap-3 px-4 pb-2.5 -mt-1 text-[10px] text-ink-faint">
            <span>{airport.reportCount} report{airport.reportCount !== 1 ? 's' : ''}</span>
            {airport.lastReport && <span>{formatTimeAgo(airport.lastReport)}</span>}
            {airport.checkpoints.length > 1 && (
              <span className="ml-auto flex gap-2">
                {airport.checkpoints.slice(0, 2).map(cp => {
                  const cpColor = getWaitColor(getWaitLevel(cp.avgWait));
                  return (
                    <span key={cp.id}>
                      {cp.isPrecheck ? 'Pre' : cp.terminal} <span className={`mono font-medium ${cpColor}`}>{cp.avgWait}m</span>
                    </span>
                  );
                })}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Desktop: richer card */}
      <div className="hidden sm:block p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="mono text-xl font-bold text-ink tracking-tight">{airport.code}</span>
              {hasData && (
                <span className={`w-2 h-2 rounded-full ${dotColor} ${level === 'high' ? 'live-dot' : ''}`} />
              )}
            </div>
            <p className="text-sm text-ink-muted truncate mt-0.5">{airport.city}, {airport.state}</p>
          </div>

          {hasData ? (
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${bgAccent} flex-shrink-0`}>
              <span className={`mono text-2xl font-bold ${color}`}>{airport.avgWait}</span>
              <span className={`mono text-xs ${color} opacity-70`}>min</span>
            </div>
          ) : (
            <span className="text-sm text-ink-faint mono">--</span>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-ink-muted">
          <span>{airport.reportCount} report{airport.reportCount !== 1 ? 's' : ''}</span>
          {airport.lastReport && (
            <span className="text-ink-faint">{formatTimeAgo(airport.lastReport)}</span>
          )}
        </div>

        {hasData && airport.checkpoints.length > 1 && (
          <div className="mt-3 pt-3 border-t border-border-light flex gap-3">
            {airport.checkpoints.slice(0, 3).map(cp => {
              const cpColor = getWaitColor(getWaitLevel(cp.avgWait));
              return (
                <div key={cp.id} className="text-xs">
                  <span className="text-ink-faint">{cp.isPrecheck ? 'Pre\u2713' : cp.terminal}</span>
                  <span className={`ml-1.5 mono font-medium ${cpColor}`}>{cp.avgWait}m</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
