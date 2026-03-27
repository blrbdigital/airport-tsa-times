import { getWaitLevel, getWaitColor, formatTimeAgo } from '../lib/types';
import type { WaitReport } from '../lib/types';

interface LiveFeedProps {
  reports: WaitReport[];
  maxItems?: number;
}

export default function LiveFeed({ reports, maxItems = 8 }: LiveFeedProps) {
  const displayed = reports.slice(0, maxItems);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-wait-green live-dot" />
        <h3 className="text-sm font-semibold text-ink">Live Reports</h3>
      </div>

      <div className="space-y-1.5">
        {displayed.map((report, i) => {
          const level = getWaitLevel(report.waitMinutes);
          const color = getWaitColor(level);

          return (
            <div
              key={report.id}
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-surface border border-border-light/60 animate-slide-up"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
            >
              <span className="mono text-xs font-bold text-coral w-8 flex-shrink-0">
                {report.airportCode}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-ink-muted truncate block">
                  {report.checkpointName}
                </span>
              </div>
              <span className={`mono text-sm font-bold ${color} flex-shrink-0`}>
                {report.waitMinutes}m
              </span>
              <span className="text-[10px] text-ink-faint flex-shrink-0 w-12 text-right">
                {formatTimeAgo(report.reportedAt)}
              </span>
            </div>
          );
        })}

        {displayed.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-ink-faint">No reports yet today.</p>
            <p className="text-xs text-ink-faint mt-1">Be the first to report!</p>
          </div>
        )}
      </div>
    </div>
  );
}
