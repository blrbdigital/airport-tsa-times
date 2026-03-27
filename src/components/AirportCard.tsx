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
    medium: 'bg-wait-yellow',
    high: 'bg-wait-red',
  }[level];

  return (
    <Link
      to={`/airport/${airport.code.toLowerCase()}`}
      className="block bg-terminal-card border border-terminal-border rounded-xl p-4 card-lift hover:border-terminal-border-light animate-slide-up"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'backwards' }}
    >
      <div className="flex items-start justify-between mb-3">
        {/* Airport code + name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="board-text text-xl font-bold text-slate-100">
              {airport.code}
            </span>
            {hasData && (
              <span className={`w-2 h-2 rounded-full ${dotColor} ${level === 'high' ? 'live-pulse' : ''}`} />
            )}
          </div>
          <p className="text-sm text-slate-400 truncate mt-0.5">
            {airport.city}, {airport.state}
          </p>
        </div>

        {/* Wait time */}
        {hasData ? (
          <div className="text-right flex-shrink-0">
            <div className={`board-text text-2xl font-bold ${color}`}>
              {airport.avgWait}
              <span className="text-sm opacity-60 ml-0.5">m</span>
            </div>
          </div>
        ) : (
          <div className="text-right">
            <span className="text-sm text-slate-600 board-text">—</span>
          </div>
        )}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{airport.reportCount} report{airport.reportCount !== 1 ? 's' : ''} today</span>
        {airport.lastReport && (
          <span>{formatTimeAgo(airport.lastReport)}</span>
        )}
      </div>

      {/* Checkpoint preview row */}
      {hasData && airport.checkpoints.length > 1 && (
        <div className="mt-3 pt-3 border-t border-terminal-border flex gap-2 overflow-x-auto">
          {airport.checkpoints.slice(0, 3).map(cp => {
            const cpLevel = getWaitLevel(cp.avgWait);
            const cpColor = getWaitColor(cpLevel);
            return (
              <div key={cp.id} className="flex-shrink-0 text-xs">
                <span className="text-slate-500">{cp.isPrecheck ? 'Pre✓' : cp.terminal}</span>
                <span className={`ml-1.5 board-text font-medium ${cpColor}`}>{cp.avgWait}m</span>
              </div>
            );
          })}
          {airport.checkpoints.length > 3 && (
            <span className="text-xs text-slate-600">+{airport.checkpoints.length - 3}</span>
          )}
        </div>
      )}
    </Link>
  );
}
