import { getWaitLevel, getWaitColor, formatTimeAgo } from '../lib/types';
import type { WaitReport } from '../lib/types';

interface LiveFeedProps {
  reports: WaitReport[];
  maxItems?: number;
}

export default function LiveFeed({ reports, maxItems = 8 }: LiveFeedProps) {
  const displayed = reports.slice(0, maxItems);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-wait-green live-pulse" />
        <h3 className="text-sm font-medium text-slate-300">Live Reports</h3>
      </div>

      <div className="space-y-1.5">
        {displayed.map((report, i) => {
          const level = getWaitLevel(report.waitMinutes);
          const color = getWaitColor(level);

          return (
            <div
              key={report.id}
              className="flex items-center gap-3 py-2 px-3 rounded-lg bg-terminal-card/50 border border-terminal-border/50 animate-slide-up"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
            >
              <span className="board-text text-xs font-bold text-amber w-8 flex-shrink-0">
                {report.airportCode}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-slate-400 truncate block">
                  {report.checkpointName}
                </span>
              </div>
              <span className={`board-text text-sm font-bold ${color} flex-shrink-0`}>
                {report.waitMinutes}m
              </span>
              <span className="text-[10px] text-slate-600 flex-shrink-0 w-12 text-right">
                {formatTimeAgo(report.reportedAt)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
