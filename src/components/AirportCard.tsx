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

  return (
    <Link
      to={`/airport/${airport.code.toLowerCase()}`}
      className="block bg-surface rounded-2xl p-4 sm:p-5 hover-lift border border-border-light active:bg-surface-hover animate-slide-up shadow-sm tap-target"
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms`, animationFillMode: 'backwards' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="mono text-lg sm:text-xl font-bold text-ink tracking-tight">
              {airport.code}
            </span>
            {hasData && (
              <span className={`w-2 h-2 rounded-full ${dotColor} ${level === 'high' ? 'live-dot' : ''}`} />
            )}
          </div>
          <span className="text-sm text-ink-muted truncate hidden sm:inline">
            {airport.city}
          </span>
          <span className="text-xs text-ink-muted truncate sm:hidden">
            {airport.city}
          </span>
        </div>

        {hasData ? (
          <div className={`mono text-2xl font-bold ${color} flex-shrink-0 ml-3`}>
            {airport.avgWait}
            <span className="text-sm opacity-60 ml-0.5">m</span>
          </div>
        ) : (
          <span className="text-sm text-ink-faint mono flex-shrink-0 ml-3">--</span>
        )}
      </div>

      {/* Bottom row — compact */}
      <div className="flex items-center justify-between mt-2 text-[11px] text-ink-muted">
        <span>{airport.reportCount} report{airport.reportCount !== 1 ? 's' : ''}</span>
        <div className="flex items-center gap-2">
          {hasData && airport.checkpoints.length > 1 && (
            <div className="flex gap-2">
              {airport.checkpoints.slice(0, 2).map(cp => {
                const cpColor = getWaitColor(getWaitLevel(cp.avgWait));
                return (
                  <span key={cp.id} className="flex items-center gap-1">
                    <span className="text-ink-faint">{cp.isPrecheck ? 'Pre' : cp.terminal}</span>
                    <span className={`mono font-medium ${cpColor}`}>{cp.avgWait}m</span>
                  </span>
                );
              })}
            </div>
          )}
          {airport.lastReport && (
            <span className="text-ink-faint">{formatTimeAgo(airport.lastReport)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
