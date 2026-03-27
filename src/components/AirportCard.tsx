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
      className="block bg-surface rounded-2xl p-5 hover-lift border border-border-light hover:border-border animate-slide-up shadow-sm"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'backwards' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="mono text-xl font-bold text-ink tracking-tight">
              {airport.code}
            </span>
            {hasData && (
              <span className={`w-2 h-2 rounded-full ${dotColor} ${level === 'high' ? 'live-dot' : ''}`} />
            )}
          </div>
          <p className="text-sm text-ink-muted truncate mt-0.5">
            {airport.city}, {airport.state}
          </p>
        </div>

        {hasData ? (
          <div className="text-right flex-shrink-0">
            <div className={`mono text-2xl font-bold ${color}`}>
              {airport.avgWait}
              <span className="text-sm opacity-60 ml-0.5">m</span>
            </div>
          </div>
        ) : (
          <div className="text-right">
            <span className="text-sm text-ink-faint mono">--</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span>{airport.reportCount} report{airport.reportCount !== 1 ? 's' : ''} today</span>
        {airport.lastReport && (
          <span className="text-ink-faint">{formatTimeAgo(airport.lastReport)}</span>
        )}
      </div>

      {hasData && airport.checkpoints.length > 1 && (
        <div className="mt-3 pt-3 border-t border-border-light flex gap-3 overflow-x-auto">
          {airport.checkpoints.slice(0, 3).map(cp => {
            const cpLevel = getWaitLevel(cp.avgWait);
            const cpColor = getWaitColor(cpLevel);
            return (
              <div key={cp.id} className="flex-shrink-0 text-xs">
                <span className="text-ink-faint">{cp.isPrecheck ? 'Pre\u2713' : cp.terminal}</span>
                <span className={`ml-1.5 mono font-medium ${cpColor}`}>{cp.avgWait}m</span>
              </div>
            );
          })}
          {airport.checkpoints.length > 3 && (
            <span className="text-xs text-ink-faint">+{airport.checkpoints.length - 3}</span>
          )}
        </div>
      )}
    </Link>
  );
}
